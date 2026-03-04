import axios from 'axios';
import { API_HOST } from './config';
import { getAccessToken } from './auth';

const BASE_URL = `${API_HOST}/api/repatriation-trips`;

/**
 * Save a new repatriation trip or update an existing one
 * @param {Object} payload - The repatriation trip data
 */
export const saveRepatriationTrip = async (payload) => {
    try {
        const token = getAccessToken();
        const res = await axios.post(BASE_URL, payload, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    } catch (error) {
        console.error('Error saving repatriation trip:', error.response || error);
        throw error;
    }
};

/**
 * Fetch the last odometer closing for a vehicle
 * @param {string|number} vehicleId - The ID of the vehicle
 */
export const fetchLastClosingOdo = async (vehicleId) => {
    try {
        const token = getAccessToken();
        const res = await axios.get(`${BASE_URL}/last-closing?vehicleId=${vehicleId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching last closing odometer:', error.response || error);
        throw error;
    }
};

/**
 * List repatriation trips with optional filters
 * @param {Object} filters - Search filters (caseId, vehicleId)
 */
export const fetchRepatriationTrips = async (filters = {}) => {
    try {
        const token = getAccessToken();
        const params = new URLSearchParams(filters).toString();
        const url = params ? `${BASE_URL}?${params}` : BASE_URL;
        const res = await axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data.trips || [];
    } catch (error) {
        console.error('Error fetching repatriation trips:', error.response || error);
        throw error;
    }
};
