import { client, tablesDB } from "@/lib/appwrite";
import { config } from "@/lib/config";
import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export const Profile = () => {
  const { id } = useParams();
  useEffect(() => {
    const unsub = client.subscribe(
      [
        `databases.${config.appwrite.databaseId}.tables.profiledetails.rows`,
      ],
      (response) => {
        console.log(response);
      }
    );
    return () => unsub();
  }, []);

  return <div>Profile : {id}</div>;
};
