import { client, tablesDB } from "@/lib/appwrite";
import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export const Profile = () => {
  const { id } = useParams();
  useEffect(() => {
    const unsub = client.subscribe(
      [
        `databases.${
          import.meta.env.VITE_APPWRITE_DB_ID
        }.tables.profiledetails.rows`,
      ],
      (response) => {
        console.log(response);
      }
    );
    return () => unsub();
  }, []);

  return <div>Profile : {id}</div>;
};
