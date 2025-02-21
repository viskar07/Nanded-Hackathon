import { AuthFormProps, SIGN_IN_FORM, SIGN_UP_FORM } from "./form"

type ConstantsProps = {
    // landingPageMenu: MenuProps[]
    signUpForm: AuthFormProps[]
    signInForm: AuthFormProps[]
    // groupList: GroupListProps[]
    // createGroupPlaceholder: CreateGroupPlaceholderProps[]
    // sideBarMenu: MenuProps[]
  }
  
  export const CONSTANTS: ConstantsProps = {
    // landingPageMenu: LANDING_PAGE_MENU,
    signUpForm: SIGN_UP_FORM,
    signInForm: SIGN_IN_FORM,
    // sideBarMenu: SIDEBAR_SETTINGS_MENU,
    // groupList: GROUP_LIST,
    // createGroupPlaceholder: CREATE_GROUP_PLACEHOLDER,
    // groupPageMenu: GROUP_PAGE_MENU,
  }