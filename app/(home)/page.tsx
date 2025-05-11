import Users from "@/components/users";
import Posts from "@/components/posts";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Page() {
  return (
    <div>
      <ThemeSwitcher />
      <Users />
      <Posts />
    </div>
  );
}
