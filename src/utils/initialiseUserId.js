import { useEffect } from "react";
import { v4 as uuid } from "uuid";

const initialiseUserId = (setUserId) => {
  useEffect(() => {
    const userIdFromLocalstorage = localStorage.getItem("userId");
    if (!userIdFromLocalstorage) {
      const newUserId = uuid();
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    } else {
      setUserId(userIdFromLocalstorage);
    }
  });
};

export default initialiseUserId;
