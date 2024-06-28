import {useTranslation} from 'react-i18next';

export default function useIntl() {
  const {t} = useTranslation();
  const formatMessage = (id: string, value?: Record<string, any>) => {
    return t(id, value);
  };
  return {formatMessage};
}
