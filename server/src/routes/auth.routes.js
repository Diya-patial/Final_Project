const {Router}=require('express');
const authController=require('../controller/auth.controller')
const authRouter=Router();
const authMiddleware=require("../middleware/auth.middleware")
/***
 * @route /api/auth/register
 */

authRouter.post('/register',authController.registerController);
authRouter.post("/login",authController.loginController)
authRouter.get("/logout",authController.logoutController)
authRouter.get("/get-me",authMiddleware.authUser,authController.getmeController);

module.exports=authRouter;



// async function handlerlogout() {
//     try {
//       await api.get("/auth/logout", {
//         withCredentials: true, // ✅ sends cookie to backend
//       });
//        toast.success("Logged out successfully ✅");
//       setTimeout(() => {
//       navigate("/");
//     }, 1000);
//     } catch (error) {
//       toast.error("Failed to Logout")
//     }
//   }

// .logoutBtn {
//   all: unset;
//   cursor: pointer;
//   display: inline;
// }
// {" "}
//                     <button
//                       onClick={handlerlogout}
//                       className={styles.logoutBtn}
//                     >
//                       Sign Out
//                     </button>