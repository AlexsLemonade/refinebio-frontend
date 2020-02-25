import { isServer } from '../common/helpers';

export default function NoSSR({ children }) {
  if (isServer) return null;
  return children;
}
