import axios from "axios";
import { API_HOST } from "./config";
import { getAccessToken } from "./auth";

const BASE_URL = `${API_HOST}/api/dashboard`;

export const fetchDashboardData = async (params = {}) => {
    try {
        const token = getAccessToken();
        const res = await axios.get(BASE_URL, {
            params,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching dashboard data:", err.response || err);
        throw err;
    }
};
