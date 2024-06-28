import {useDispatch, useSelector} from 'react-redux';
import {AppDispatchType, AppSelectorType, RootStateType} from '../../store';
import {useMemo} from 'react';

type MapStateToPropsType<TStateProps> = (
  selector: AppSelectorType,
) => TStateProps;
type MapDispatchToPropsType<TDispatchProps> = (
  dispatch: AppDispatchType,
) => TDispatchProps;

export default function useConnect<TStateProps = {}, TDispatchProps = {}>(
  mapStateToProps: MapStateToPropsType<TStateProps> | null,
  mapDispatchToProps: MapDispatchToPropsType<TDispatchProps> | null,
) {
  const selector = useSelector<RootStateType>;
  const dispatch = useDispatch<AppDispatchType>();
  const stateProps =
    typeof mapStateToProps === 'function'
      ? mapStateToProps(selector)
      : ({} as TStateProps);

  const dispatchProps = useMemo(
    () =>
      typeof mapDispatchToProps === 'function'
        ? mapDispatchToProps(dispatch)
        : ({} as TDispatchProps),
    [dispatch, mapDispatchToProps],
  );

  return {...stateProps, ...dispatchProps};
}
