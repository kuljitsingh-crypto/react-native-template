import {createCustomAsyncThunk} from '../../utill';

const pageDataLoader = 'app/splash/PAGE_DATA_LOADER';

export const loadData = createCustomAsyncThunk(
  pageDataLoader,
  async (params: any, {dispatch}) => {},
);
