import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";


export default function ResetPassword() {
  return (
    <>
      <PageMeta
        title="Azmoonhub | ForgotPassword"
        description="Azmoon test center"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
