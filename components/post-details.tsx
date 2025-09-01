"use client";

import { ThemeContext } from "@/contexts/theme-provider";
import { Post } from "@/prisma/generated-prisma-client";
import { use } from "react";
import styles from "./post-details.module.css";
import Link from "next/link";

interface PostDetailsProps {
  post: Partial<Post>;
  withEdit?: boolean;
  withDelete?: boolean;
  withShowDetails?: boolean;
}

export default function PostDetails({
  post,
  withEdit = false,
  withDelete = false,
  withShowDetails = false,
}: PostDetailsProps) {
  const theme = use(ThemeContext);

  const postJson = JSON.stringify(post, null, 2);
  return (
    <div
      style={{
        position: "relative",
        width: "350px",
      }}
    >
      {withShowDetails && (
        <div
          style={{
            fontSize: "12px",
            position: "absolute",
            left: "90%",
            width: "100px",
            top: "0px",
          }}
          className={
            styles[
              theme === "light" ? "hoverStyleForLight" : "hoverStyleForDark"
            ]
          }
        >
          <Link
            style={{
              color: theme === "light" ? "magenta" : "lightpink",
              textDecoration: "none",
            }}
            href={`/posts/${post.id}`}
          >
            View Post
          </Link>
        </div>
      )}

      <pre style={{ transition: "color 0.3s ease-in-out" }}>{postJson}</pre>
    </div>
  );
}
