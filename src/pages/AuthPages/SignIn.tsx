import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Azmoonhub | SignIn"
        description="Azmoon test center"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
