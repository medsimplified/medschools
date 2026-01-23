import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import LoginArea from "./LoginArea"

const Login = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Welcome Back" sub_title="Login" />
            <LoginArea />
         </main>
         {/* <FooterTwo /> */}
      </>
   )
}

export default Login

