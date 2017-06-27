import React from "react";

import UserMenuItem from "../../../components//User/MenuItem";
import withAuthInfo from "../../../hoc/withAuthInfo";

const UserMenuItemContainer = withAuthInfo()(UserMenuItem);
export default UserMenuItemContainer;
