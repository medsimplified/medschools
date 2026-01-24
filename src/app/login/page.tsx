import Login from "@/components/inner-pages/login";
import Registration from "@/components/inner-pages/registration";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Login | Access Your Account - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <Login />
      </Wrapper>
   )
}

export default index