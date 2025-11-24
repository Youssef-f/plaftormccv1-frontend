"use client";
import { useEffect } from "react";


export function useAuth() {
useEffect(() => {
const token = localStorage.getItem("token");


if (!token) {
window.location.href = "/login";
}
}, []);


return {
logout: () => {
localStorage.removeItem("token");
window.location.href = "/login";
},
};
}