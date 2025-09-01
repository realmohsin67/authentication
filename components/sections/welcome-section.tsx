import { cookies } from "next/headers";
import ToasterButton from "../buttons/toast-button";
import SendEmail from "../send-email";
import { getUser } from "@/utils/auth-functions";
import log from "@/utils/consoleLogger";

export default async function WelcomeSection() {
  log.warn("Loading WelcomeSection...");
  const cookieStore = await cookies();
  const user = await getUser(cookieStore, { name: true });
  const isLoggedIn = Boolean(user);
  log.success("Done with loading WelcomeSection");
  return (
    <div
      style={{
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Welcome</h1>
          <ToasterButton
            toastMessage={isLoggedIn ? "I'm logged in!" : "I need to log in!"}
          />
        </div>

        {user && (
          <div>
            <p>
              {user.name
                ? `Hello, ${user.name}!`
                : "Hello, Guest! Please log in."}
            </p>
            <SendEmail />
          </div>
        )}
      </div>
    </div>
  );
}
