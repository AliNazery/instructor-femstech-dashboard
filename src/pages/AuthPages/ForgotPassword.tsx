import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";


export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Azmoonhub | ForgotPassword"
        description="Azmoon test center"
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
