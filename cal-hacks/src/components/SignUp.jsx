const SignUp = () => {
  const {googleSignIn} = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

    return (
        <div onClick={handleSignIn}>
            logofcases
        </div>
    )
}

export default SignUp;