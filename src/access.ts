/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    designUser: currentUser && currentUser.access === 'design_user',
    endUser: currentUser && currentUser.access === 'end_user',
    adminUser: currentUser && currentUser.access === 'admin',
  };
}
