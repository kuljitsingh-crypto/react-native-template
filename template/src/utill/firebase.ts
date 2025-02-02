import cloudMessaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import firestore, {
  Filter,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {config} from '../custom-config';

export type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;
export type RemoteMessageHandler = (
  message: RemoteMessage,
) => any | Promise<any>;

type ExtendedQueryOperator =
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | '!='
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';

type ExtraQueryOperator = 'and' | 'or';
type DocumentReference =
  FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
type NormalQueryType = {
  value: any;
  optr: ExtendedQueryOperator;
  fieldName: string;
};

type FirebaseQuery = (
  | NormalQueryType
  | {
      firstCondition: NormalQueryType;
      optr: ExtraQueryOperator;
      secondCondition: NormalQueryType;
    }
)[];

type FirebaseSinglQuery =
  | NormalQueryType
  | {
      firstCondition: NormalQueryType;
      optr: ExtraQueryOperator;
      secondCondition: NormalQueryType;
    };

type FirestoreDataType = {attributes: any; id: string; type: string};
const reference = 'reference';

const firebaseMessaging = config.isRemotePushNotificationEnabled
  ? cloudMessaging()
  : null;

const registerDeviceForRemoteMessages = async () => {
  if (
    firebaseMessaging &&
    !firebaseMessaging.isDeviceRegisteredForRemoteMessages &&
    config.isRemotePushNotificationEnabled
  ) {
    await firebaseMessaging.registerDeviceForRemoteMessages();
  }
};

const getFCMToken = async () => {
  if (!config.isRemotePushNotificationEnabled || !firebaseMessaging) {
    return {token: null, isSucess: true};
  }
  try {
    await registerDeviceForRemoteMessages();
    const token = await firebaseMessaging.getToken();
    return {token, isSucess: true};
  } catch (err) {
    return {token: null, isSucess: false};
  }
};

const onForegroundMessageReceived = (messageHandeler: RemoteMessageHandler) => {
  if (!config.isRemotePushNotificationEnabled) {
    return () => {};
  }
  const unsubscribeCb = firebaseMessaging?.onMessage(messageHandeler);
  if (typeof unsubscribeCb === 'function') {
    return unsubscribeCb;
  }
  return () => {};
};

const onBackgroundMessageReceived = (messageHandeler: RemoteMessageHandler) => {
  if (!config.isRemotePushNotificationEnabled) {
    return;
  }
  return firebaseMessaging?.setBackgroundMessageHandler(messageHandeler);
};

// ==================================== firestore ================================//

const formatQuery = (docRef: DocumentReference, qu: FirebaseSinglQuery) => {
  if (qu.optr === 'or' || qu.optr === 'and') {
    const {firstCondition, secondCondition, optr} = qu;
    const filterFn = optr === 'and' ? Filter.and : Filter.or;
    docRef = docRef.where(
      filterFn(
        Filter(
          firstCondition.fieldName,
          firstCondition.optr,
          firstCondition.value,
        ),
        Filter(
          secondCondition.fieldName,
          secondCondition.optr,
          secondCondition.value,
        ),
      ),
    ) as DocumentReference;
  } else {
    if (
      qu.hasOwnProperty('firstCondition') ||
      qu.hasOwnProperty('secondCondition')
    ) {
      throw new Error(
        'firstCondition and secondCondition is only supported for OR/AND',
      );
    }
    const {fieldName, value, optr} = qu as NormalQueryType;
    docRef = docRef.where(fieldName, optr, value) as DocumentReference;
  }
  return docRef;
};

const findByFieldPath = async (
  fieldPath: string,
): Promise<FirestoreDataType | null> => {
  return firestore()
    .doc(fieldPath)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        return {
          attributes: documentSnapshot.data(),
          id: documentSnapshot.id,
          type: documentSnapshot.ref.parent.path,
        };
      }
      return null;
    })
    .catch(error => {
      throw error;
    });
};

const getRelatedFieldData = async (d: any) => {
  if (d.type === reference && typeof d.fieldPath === 'string' && d.fieldPath) {
    return findByFieldPath(d.fieldPath);
  }
  return Promise.resolve(d);
};

const getMultiRelatedField = async (d: any[]) => {
  const maxbatchsize = d.length;
  const batchSize = Math.min(10, maxbatchsize);
  let index = 0;
  const dataArray = [];
  for (; index < maxbatchsize; index += batchSize) {
    const result = await Promise.all(
      d.slice(index, batchSize + index).map(getRelatedFieldData),
    );
    dataArray.push(...result);
  }
  return dataArray;
};

const getRelatedFieldsData = async (
  actualData: any,
  relatedFields?: string[],
) => {
  if (!relatedFields || relatedFields.length === 0) return;
  for (const field of relatedFields) {
    const d = actualData[field];
    if (typeof d === 'object' && d !== null) {
      actualData[field] = Array.isArray(d)
        ? await getMultiRelatedField(d)
        : await getRelatedFieldData(d);
    }
  }
};

const findById = async (
  collectionName: string,
  id: string,
  populateRelatedFields?: string[],
): Promise<FirestoreDataType | null> => {
  try {
    const documentSnapshot = await firestore()
      .collection(collectionName)
      .doc(id)
      .get();
    if (documentSnapshot.exists) {
      const data = documentSnapshot.data();
      await getRelatedFieldsData(data, populateRelatedFields);
      return {
        attributes: data,
        id: documentSnapshot.id,
        type: collectionName,
      };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const findOne = async (params: {
  collectionName: string;
  query: FirebaseQuery;
  orderBy?: {fieldName: string; direction?: 'asc' | 'desc'};
  populateRelatedFields?: string[];
}): Promise<FirestoreDataType | null> => {
  if (!params) return Promise.resolve(null);
  const {query, collectionName, orderBy, populateRelatedFields} = params;
  if (!query) return Promise.resolve(null);
  try {
    let docRef = firestore().collection(collectionName);
    query.forEach(qu => {
      docRef = formatQuery(docRef, qu);
    });
    if (orderBy && orderBy.fieldName) {
      docRef = docRef.orderBy(
        orderBy.fieldName,
        orderBy.direction || 'asc',
      ) as DocumentReference;
    }
    const querySnapshot = await docRef.limit(1).get();
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      await getRelatedFieldsData(data, populateRelatedFields);
      return {
        attributes: data,
        id: doc.id,
        type: collectionName,
      };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const find = async (params: {
  collectionName: string;
  query: FirebaseQuery;
  perPage?: number;
  orderBy?: {fieldName: string; direction?: 'asc' | 'desc'};
  startAt?: any;
  endAt?: any;
  startAfter?: any;
  endBefore?: any;
  populateRelatedFields?: string[];
}): Promise<{
  data: FirestoreDataType[];
  metadata: {
    totalItems: number;
    totalPages: number;
    perPage: number;
    lastPageRef: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null;
  };
}> => {
  const defaultResponse = {
    data: [],
    metadata: {totalItems: 0, totalPages: 0, lastPageRef: null, perPage: 0},
  };
  if (!params) return Promise.resolve(defaultResponse);
  const {
    query,
    collectionName,
    perPage,
    orderBy,
    startAt,
    endAt,
    startAfter,
    endBefore,
    populateRelatedFields,
  } = params;
  if (!query) return Promise.resolve(defaultResponse);
  try {
    let docRef = firestore().collection(collectionName),
      allDocRef;
    query.forEach(qu => {
      docRef = formatQuery(docRef, qu);
    });
    allDocRef = docRef.count().query;
    if (orderBy && orderBy.fieldName) {
      docRef = docRef.orderBy(
        orderBy.fieldName,
        orderBy.direction || 'asc',
      ) as DocumentReference;
    }
    if (startAfter) {
      if (!orderBy) {
        throw new Error(
          'For startAfter/startAt/endBefore/endAt OrderBy is required!',
        );
      }
      docRef = docRef.startAfter(startAfter) as DocumentReference;
    }
    if (startAt) {
      if (!orderBy) {
        throw new Error(
          'For startAfter/startAt/endBefore/endAt OrderBy is required!',
        );
      }
      docRef = docRef.startAt(startAt) as DocumentReference;
    }
    if (endAt) {
      if (!orderBy) {
        throw new Error(
          'For startAfter/startAt/endBefore/endAt OrderBy is required!',
        );
      }
      docRef = docRef.endAt(endAt) as DocumentReference;
    }
    if (endBefore) {
      if (!orderBy) {
        throw new Error(
          'For startAfter/startAt/endBefore/endAt OrderBy is required!',
        );
      }
      docRef = docRef.endBefore(endBefore) as DocumentReference;
    }
    if (perPage) {
      docRef = docRef.limit(perPage) as DocumentReference;
    }
    const totalItems = await allDocRef
      .count()
      .get()
      .then(resp => resp.data().count);
    const querySnapshot = await docRef.get();
    if (!querySnapshot.empty) {
      const dataArray: {attributes: any; id: string; type: string}[] = [];
      for (let doc of querySnapshot.docs) {
        const data = doc.data();
        await getRelatedFieldsData(data, populateRelatedFields);
        dataArray.push({
          attributes: data,
          id: doc.id,
          type: collectionName,
        });
      }
      const totalPages = perPage ? Math.ceil(totalItems / perPage) : 1;
      const metadata = {
        totalItems: totalItems,
        totalPages,
        perPage: perPage || totalItems,
        lastPageRef:
          ((perPage || 0) > 1 && querySnapshot.docs.length <= 1) ||
          totalPages <= 1
            ? null
            : querySnapshot.docs[querySnapshot.docs.length - 1],
      };
      return {data: dataArray, metadata};
    }
    return defaultResponse;
  } catch (err) {
    throw err;
  }
};

const create = async (params: {
  collectionName: string;
  id?: string;
  data: Record<string, any>;
}): Promise<FirestoreDataType | null> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id, data} = params;
  const docRef = firestore().collection(collectionName);
  if (id) {
    return docRef
      .doc(id)
      .set(data)
      .then(() => findById(collectionName, id))
      .catch(err => {
        throw err;
      });
  }
  return docRef
    .add(data)
    .then(documentSnapshot => {
      return findById(collectionName, documentSnapshot.id);
    })
    .catch(err => {
      throw err;
    });
};
const findByIdAndUpdate = (params: {
  collectionName: string;
  id: string;
  data: Record<string, any>;
}): Promise<FirestoreDataType | null> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id, data} = params;
  if (!id) {
    throw new Error('id must be provided!');
  }
  return firestore()
    .collection(collectionName)
    .doc(id)
    .update(data)
    .then(() => {
      return findById(collectionName, id);
    })
    .catch(err => {
      throw err;
    });
};

const findOneAndUpdate = async (params: {
  collectionName: string;
  query: FirebaseQuery;
  data: Record<string, any>;
}): Promise<FirestoreDataType | null> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, query, data} = params;
    if (!query) {
      throw new Error('query must be provided!');
    }
    const result = await findOne({collectionName, query});
    if (!result) return null;
    const id = result.id;
    await firestore().collection(collectionName).doc(id).update(data);
    const updatedData = await findById(collectionName, id);
    return updatedData;
  } catch (err) {
    throw err;
  }
};

const findByIdAndDelete = async (params: {
  collectionName: string;
  id: string;
}): Promise<boolean> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id} = params;
  if (!id) {
    throw new Error('id must be provided!');
  }
  return firestore()
    .collection(collectionName)
    .doc(id)
    .delete()
    .then(() => {
      return true;
    })
    .catch(err => {
      throw err;
    });
};

const findOneAndDelete = async (params: {
  collectionName: string;
  query: FirebaseQuery;
}): Promise<boolean> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, query} = params;
    if (!query) {
      throw new Error('query must be provided!');
    }
    const result = await findOne({collectionName, query});
    if (!result) return false;
    const id = result.id;
    await firestore().collection(collectionName).doc(id).delete();
    return true;
  } catch (err) {
    throw err;
  }
};

const countDocuments = async (params: {
  collectionName: string;
  query: FirebaseQuery;
}): Promise<number> => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, query} = params;
    if (!query) {
      throw new Error('query must be provided!');
    }
    let docRef = firestore().collection(collectionName);
    query.forEach(qu => {
      docRef = formatQuery(docRef, qu);
    });
    const result = await docRef.count().get();
    return result.data().count;
  } catch (err) {
    throw err;
  }
};
const updateMany = async (params: {
  collectionName: string;
  query: FirebaseQuery;
  data: Record<string, any>;
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, query, data} = params;
    if (!query) {
      throw new Error('query must be provided!');
    }
    let docRef = firestore().collection(collectionName);
    query.forEach(qu => {
      docRef = formatQuery(docRef, qu);
    });
    const querySnapshot = await docRef.get();
    const batch = firestore().batch();
    querySnapshot.forEach(documentSnapshot => {
      batch.update(documentSnapshot.ref, data);
    });
    await batch.commit();
    return {documentUpdated: querySnapshot.size};
  } catch (err) {
    throw err;
  }
};

const deleteMany = async (params: {
  collectionName: string;
  query: FirebaseQuery;
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, query} = params;
    if (!query) {
      throw new Error('query must be provided!');
    }
    let docRef = firestore().collection(collectionName);
    query.forEach(qu => {
      docRef = formatQuery(docRef, qu);
    });
    const querySnapshot = await docRef.get();
    const batch = firestore().batch();
    querySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref);
    });
    await batch.commit();
    return {documentDeleted: querySnapshot.size};
  } catch (err) {
    throw err;
  }
};

const insertMany = async (params: {
  collectionName: string;
  data: Record<string, any>[];
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  try {
    const {collectionName, data} = params;
    if (!data || data.length <= 0) {
      throw new Error('data must be provided!');
    }
    const collectionRef = firestore().collection(collectionName);
    const batch = firestore().batch();
    data.forEach(d => {
      const {id, ...rest} = d;
      const docRef = id ? collectionRef.doc(id) : collectionRef.doc();
      batch.set(docRef, rest);
    });
    await batch.commit();
    return {documentInserted: data.length};
  } catch (err) {
    throw err;
  }
};

const FirestoreFieldActions = Object.freeze({
  setServerTime: () => firestore.FieldValue.serverTimestamp(),
  changeNumberBy: (amount: number) => firestore.FieldValue.increment(amount),
  removeField: () => firestore.FieldValue.delete(),
  addToArray: (...items: any[]) => firestore.FieldValue.arrayUnion(...items),
  removeFromArray: (...items: any[]) =>
    firestore.FieldValue.arrayRemove(...items),
});
const FirestoreFieldTypes = Object.freeze({
  GeoPoint: firestore.GeoPoint,
  Timestamp: firestore.Timestamp,
  Blob: firestore.Blob,
  DocumentReference: {
    createRef: (collectionName: string, id: string) => {
      return {type: reference, fieldPath: `${collectionName}/${id}`};
    },
  },
});

const updateTransaction = async (params: {
  collectionName: string;
  id: string;
  onUpdate: (latestData: any) => Record<string, any>;
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id, onUpdate} = params;
  const docRef = firestore().collection(collectionName).doc(id);
  return firestore()
    .runTransaction(async transaction => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists || !docSnapshot) {
        throw 'Document does not exist!';
      }
      transaction.update(docRef, onUpdate(docSnapshot.data()));
    })
    .then(() => findById(collectionName, id))
    .catch(err => {
      throw err;
    });
};

const setTransaction = async (params: {
  collectionName: string;
  id: string;
  onSet: (latestData: any) => Record<string, any>;
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id, onSet} = params;
  const docRef = firestore().collection(collectionName).doc(id);
  return firestore()
    .runTransaction(async transaction => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists || !docSnapshot) {
        throw 'Document does not exist!';
      }
      transaction.set(docRef, onSet(docSnapshot.data()));
    })
    .then(() => findById(collectionName, id))
    .catch(err => {
      throw err;
    });
};

const deleteTransaction = async (params: {
  collectionName: string;
  id: string;
  onDelete: (latestData: any) => boolean;
}) => {
  if (!params) {
    throw new Error(`Invalid collection details!`);
  }
  const {collectionName, id, onDelete} = params;
  const docRef = firestore().collection(collectionName).doc(id);
  return firestore()
    .runTransaction(async transaction => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists || !docSnapshot) {
        throw 'Document does not exist!';
      }
      const shouldDelete = onDelete(docSnapshot.data());
      if (shouldDelete) {
        transaction.delete(docRef);
      }
    })
    .then(() => true)
    .catch(err => {
      throw err;
    });
};

const transaction = Object.freeze({
  update: updateTransaction,
  set: setTransaction,
  delete: deleteTransaction,
});

//=======================================================================================//

export class Firebase {
  static cloudMessaging = Object.freeze({
    getFCMToken,
    foregroundMessageHandler: onForegroundMessageReceived,
    backgroundMessageHandler: onBackgroundMessageReceived,
  });

  static cloudDatabase = Object.freeze({
    create,
    find,
    findById,
    findOne,
    findByIdAndUpdate,
    findOneAndUpdate,
    findByIdAndDelete,
    findOneAndDelete,
    countDocuments,
    updateMany,
    deleteMany,
    insertMany,
    Transaction: transaction,
    FieldActions: FirestoreFieldActions,
    FieldType: FirestoreFieldTypes,
  });
}
