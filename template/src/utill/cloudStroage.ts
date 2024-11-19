import {Firebase} from './firebase';

// For Cloud Stroage implmentation , I am using firebase firestore as cloud stroage
// you can chnage as you like, may be create an api to call server and update data at server.

// You can chnage your cloud stroage Data Type as per your need
type DatabaseDataType = {attributes: any; id: string; type: string};
type CursorBasedMetadata = {
  totalItems: number;
  totalPages: number;
  perPage: number;
  nextPageCursor: any;
};
type PageBasedMetadata = {
  totalItems: number;
  totalPages: number;
  perPage: number;
  page: number;
};
type DatabaseRelationDataType = {type: string; fieldPath: string};

type QueryOperator =
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
type NormalQueryType = {
  value: any;
  optr: QueryOperator;
  fieldName: string;
};

type Query = (
  | NormalQueryType
  | {
      firstCondition: NormalQueryType;
      optr: ExtraQueryOperator;
      secondCondition: NormalQueryType;
    }
)[];

type QueryReturn<P extends number | undefined> = P extends undefined
  ? {
      data: DatabaseDataType[];
      metadata: CursorBasedMetadata;
    }
  : {
      data: DatabaseDataType[];
      metadata: PageBasedMetadata;
    };

interface IDatabase {
  createRelationField(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): DatabaseRelationDataType;

  create(params: {
    tableName: string;
    data: Record<string, any>;
    id?: string;
    metadata?: any;
  }): Promise<DatabaseDataType | null>;

  findById(params: {
    tableName: string;
    id: string;
    populateRelatedFields?: string[];
    metadata?: any;
  }): Promise<DatabaseDataType | null>;

  findByIdAndUpdate(params: {
    tableName: string;
    id: string;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null>;

  findByIdAndDelete(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): Promise<boolean>;

  find<P extends number | undefined = undefined>(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    perPage?: number;
    orderBy?: {
      fieldName: string;
      direction?: 'asc' | 'desc';
    }[];
    startAfter?: unknown;
    startAt?: unknown;
    page?: P;
    metadata?: any;
  }): Promise<QueryReturn<P>>;

  findOne(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    orderBy?: {
      fieldName: string;
      direction?: 'asc' | 'desc';
    }[];
    metadata?: any;
  }): Promise<DatabaseDataType | null>;

  findOneAndUpdate(params: {
    tableName: string;
    query: Query;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null>;

  findOneAndDelete(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<boolean>;

  updateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null>;

  deleteTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onDelete: (currentData: DatabaseDataType) => any;
  }): Promise<boolean>;

  createOrUpdateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onCreateOrUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null>;

  countData(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<number>;
}

class FirebaseDatabase implements IDatabase {
  static #instance: FirebaseDatabase | null = null;

  constructor() {
    if (FirebaseDatabase.#instance === null) {
      FirebaseDatabase.#instance = this;
    }
    return FirebaseDatabase.#instance;
  }

  createRelationField(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): DatabaseRelationDataType {
    const {id, tableName, metadata} = params;
    return Firebase.cloudDatabase.FieldType.DocumentReference.createRef(
      tableName,
      id,
    );
  }
  async create(params: {
    tableName: string;
    data: Record<string, any>;
    id?: string;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, data, metadata} = params;
    return Firebase.cloudDatabase.create({
      collectionName: tableName,
      id,
      data: data,
    });
  }

  async findById(params: {
    tableName: string;
    id: string;
    populateRelatedFields?: string[];
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, populateRelatedFields} = params;
    return Firebase.cloudDatabase.findById(
      tableName,
      id,
      populateRelatedFields,
    );
  }

  async findByIdAndUpdate(params: {
    tableName: string;
    id: string;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, data} = params;
    return Firebase.cloudDatabase.findByIdAndUpdate({
      collectionName: tableName,
      id,
      data,
    });
  }

  async findByIdAndDelete(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): Promise<boolean> {
    const {tableName, id, metadata} = params;
    return Firebase.cloudDatabase.findByIdAndDelete({
      collectionName: tableName,
      id,
    });
  }

  async find<P extends number | undefined = undefined>(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    perPage?: number;
    orderBy?: {fieldName: string; direction?: 'asc' | 'desc'}[];
    startAfter?: unknown;
    startAt?: unknown;
    page?: P;
    metadata?: any;
  }): Promise<QueryReturn<P>> {
    const {
      tableName,
      query,
      page,
      perPage,
      populateRelatedFields,
      startAfter,
      startAt,
      orderBy,
      metadata,
    } = params;
    const result = await Firebase.cloudDatabase.find({
      collectionName: tableName,
      query,
      perPage,
      orderBy: orderBy?.[0],
      startAfter,
      startAt,
      populateRelatedFields,
    });
    const {lastPageRef, ...rest} = result.metadata;
    const data = result.data as DatabaseDataType[];
    if (typeof page === 'number' && page) {
      const newResult = {
        data,
        metadata: {page: page + 1, ...rest},
      };
      return newResult as QueryReturn<P>;
    } else {
      const newResult = {
        data,
        metadata: {...rest, nextPageCursor: lastPageRef},
      };
      return newResult as QueryReturn<P>;
    }
  }

  async findOne(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    orderBy?: {fieldName: string; direction?: 'asc' | 'desc'}[];
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, query, populateRelatedFields, orderBy, metadata} = params;
    const result = await Firebase.cloudDatabase.findOne({
      collectionName: tableName,
      query,
      orderBy: orderBy?.[0],
      populateRelatedFields,
    });
    return result;
  }

  async findOneAndUpdate(params: {
    tableName: string;
    query: Query;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, query, data, metadata} = params;
    const result = await Firebase.cloudDatabase.findOneAndUpdate({
      collectionName: tableName,
      query,
      data,
    });
    return result;
  }

  async findOneAndDelete(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<boolean> {
    const {tableName, query, metadata} = params;
    const result = await Firebase.cloudDatabase.findOneAndDelete({
      collectionName: tableName,
      query,
    });
    return result;
  }

  async updateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, onUpdate} = params;
    const result = await Firebase.cloudDatabase.Transaction.update({
      collectionName: tableName,
      id,
      onUpdate,
    });
    return result;
  }

  async deleteTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onDelete: (currentData: DatabaseDataType) => any;
  }): Promise<boolean> {
    const {tableName, id, metadata, onDelete} = params;
    const result = await Firebase.cloudDatabase.Transaction.delete({
      collectionName: tableName,
      id,
      onDelete,
    });
    return result;
  }

  async createOrUpdateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onCreateOrUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, onCreateOrUpdate} = params;
    const result = await Firebase.cloudDatabase.Transaction.set({
      collectionName: tableName,
      id,
      onSet: onCreateOrUpdate,
    });
    return result;
  }

  async countData(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<number> {
    const {tableName, query, metadata} = params;
    const result = await Firebase.cloudDatabase.countDocuments({
      collectionName: tableName,
      query,
    });
    return result;
  }
}

class DatabaseAdapter {
  static #dbInstance: IDatabase;

  static setDatabase(database: IDatabase) {
    DatabaseAdapter.#dbInstance = database;
  }

  static createRelationField(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): DatabaseRelationDataType {
    const {id, tableName, metadata} = params;
    return DatabaseAdapter.#dbInstance.createRelationField({
      tableName,
      id,
      metadata,
    });
  }

  static async create(params: {
    tableName: string;
    data: Record<string, any>;
    id?: string;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, data, metadata} = params;
    return DatabaseAdapter.#dbInstance.create({
      tableName: tableName,
      id,
      data: data,
      metadata,
    });
  }

  static async findById(params: {
    tableName: string;
    id: string;
    populateRelatedFields?: string[];
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, populateRelatedFields} = params;
    return DatabaseAdapter.#dbInstance.findById({
      tableName,
      id,
      populateRelatedFields,
      metadata,
    });
  }

  static async findByIdAndUpdate(params: {
    tableName: string;
    id: string;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, data} = params;
    return DatabaseAdapter.#dbInstance.findByIdAndUpdate({
      tableName,
      id,
      data,
      metadata,
    });
  }

  static async findByIdAndDelete(params: {
    tableName: string;
    id: string;
    metadata?: any;
  }): Promise<boolean> {
    const {tableName, id, metadata} = params;
    return DatabaseAdapter.#dbInstance.findByIdAndDelete({
      tableName,
      id,
      metadata,
    });
  }

  static async find<P extends number | undefined = undefined>(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    perPage?: number;
    orderBy?: {fieldName: string; direction?: 'asc' | 'desc'}[];
    startAfter?: unknown;
    startAt?: unknown;
    page?: P;
    metadata?: any;
  }): Promise<QueryReturn<P>> {
    const {
      tableName,
      query,
      page,
      perPage,
      populateRelatedFields,
      startAfter,
      startAt,
      orderBy,
      metadata,
    } = params;
    const result = await DatabaseAdapter.#dbInstance.find({
      tableName,
      query,
      perPage,
      orderBy,
      startAfter,
      startAt,
      populateRelatedFields,
      page,
      metadata,
    });
    return result as QueryReturn<P>;
  }

  static async findOne(params: {
    tableName: string;
    query: Query;
    populateRelatedFields?: string[];
    orderBy?: {fieldName: string; direction?: 'asc' | 'desc'}[];
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, query, populateRelatedFields, orderBy, metadata} = params;
    const result = await DatabaseAdapter.#dbInstance.findOne({
      tableName,
      query,
      orderBy,
      populateRelatedFields,
      metadata,
    });
    return result;
  }

  static async findOneAndUpdate(params: {
    tableName: string;
    query: Query;
    data: Record<string, any>;
    metadata?: any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, query, data, metadata} = params;
    const result = await DatabaseAdapter.#dbInstance.findOneAndUpdate({
      tableName,
      query,
      data,
      metadata,
    });
    return result;
  }

  static async findOneAndDelete(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<boolean> {
    const {tableName, query, metadata} = params;
    const result = await DatabaseAdapter.#dbInstance.findOneAndDelete({
      tableName,
      query,
      metadata,
    });
    return result;
  }

  static async updateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, onUpdate} = params;
    const result = await DatabaseAdapter.#dbInstance.updateTransactionData({
      tableName,
      id,
      metadata,
      onUpdate,
    });
    return result;
  }

  static async deleteTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onDelete: (currentData: DatabaseDataType) => any;
  }): Promise<boolean> {
    const {tableName, id, metadata, onDelete} = params;
    const result = await DatabaseAdapter.#dbInstance.deleteTransactionData({
      tableName,
      id,
      metadata,
      onDelete,
    });
    return result;
  }

  static async createOrUpdateTransactionData(params: {
    tableName: string;
    id: string;
    metadata?: any;
    onCreateOrUpdate: (currentData: DatabaseDataType) => any;
  }): Promise<DatabaseDataType | null> {
    const {tableName, id, metadata, onCreateOrUpdate} = params;
    const result =
      await DatabaseAdapter.#dbInstance.createOrUpdateTransactionData({
        tableName,
        id,
        metadata,
        onCreateOrUpdate,
      });
    return result;
  }

  static async countData(params: {
    tableName: string;
    query: Query;
    metadata?: any;
  }): Promise<number> {
    const {tableName, query, metadata} = params;
    const result = await DatabaseAdapter.#dbInstance.countData({
      tableName,
      query,
      metadata,
    });
    return result;
  }
}

DatabaseAdapter.setDatabase(new FirebaseDatabase());

//============================ paypal=================================

class Paypal {
  static #instance: Paypal | null = null;

  constructor() {
    if (Paypal.#instance === null) {
      Paypal.#instance = this;
    }
    return Paypal.#instance;
  }

  addPaypalOrderDetails = (params: {
    id?: string;
    orderDetails: Record<string, any>;
    metadata?: any;
  }) => {
    try {
      const {id, orderDetails, metadata} = params;
      return DatabaseAdapter.create({
        tableName: 'paypal-order',
        id,
        data: orderDetails,
        metadata,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

//=====================================================================

export class CloudStroage {
  static paypal = new Paypal();
}
