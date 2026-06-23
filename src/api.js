const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api'
  : 'https://resigntrackbackend.onrender.com/api';

// Helper wrapper to append Bearer token and handle errors
async function request(url, options = {}) {
  const token = localStorage.getItem('access_token');
  options.headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, options);

  if (res.status === 401) {
    // Clear credentials on authentication expiration
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Only reload/force log out if we actually tried to run an authenticated request
    if (token) {
      window.location.reload();
      throw new Error('Session expired or unauthorized');
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.detail || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────
export async function login(email, password, role) {
  const data = await request(`${API_BASE}/login/`, {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
  if (data.access) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      username: data.username,
      role: data.role,
      fullName: data.fullName,
      phone: data.phone,
      dob: data.dob,
      designation: data.designation,
      address: data.address,
    }));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ─── Users ──────────────────────────────────────────────
export async function fetchUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.role) query.append('role', params.role);
  if (params.status) query.append('status', params.status);
  const queryString = query.toString();
  const url = queryString ? `${API_BASE}/users/?${queryString}` : `${API_BASE}/users/`;
  return request(url);
} export async function fetchUserById(id) {
  return request(`${API_BASE}/users/${id}/`);
}

export async function fetchEmployeeById(id) {
  return request(`${API_BASE}/employees/${id}/`);
}

export async function createUser(data) {
  return request(`${API_BASE}/users/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id, data) {
  return request(`${API_BASE}/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return request(`${API_BASE}/users/${id}/`, {
    method: 'DELETE',
  });
}


// ─── Resignations ───────────────────────────────────────
export async function fetchResignations() {
  return request(`${API_BASE}/resignations/`);
}

export async function fetchDraftResignation() {
  return request(`${API_BASE}/resignations/draft/`);
}

export async function saveDraftResignation(data, id = null) {
  if (id) {
    return request(`${API_BASE}/resignations/draft/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } else {
    return request(`${API_BASE}/resignations/draft/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export async function submitResignation(data) {
  return request(`${API_BASE}/resignations/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchDashboardSummary() {
  return request(`${API_BASE}/dashboard/`);
}

export async function fetchEmployeeResignationStatus() {
  return request(`${API_BASE}/resignations/status/`);
}

export async function fetchNoticePeriod() {
  return request(`${API_BASE}/resignations/notice-period/`);
}

export async function fetchChecklistTasks() {
  return request(`${API_BASE}/resignations/checklist/`);
}

export async function fetchResignationChecklistTasksForHR(resignationId) {
  return request(`${API_BASE}/resignations/${resignationId}/checklist/`);
}

export async function updateChecklistTaskStatus(taskId, status) {
  return request(`${API_BASE}/resignations/checklist/${taskId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function updateResignationStatus(id, status) {
  return request(`${API_BASE}/resignations/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function withdrawResignation(id) {
  return request(`${API_BASE}/resignations/${id}/withdraw/`, {
    method: 'PATCH',
  });
}

// ─── System Settings ────────────────────────────────────
export async function fetchSettings() {
  return request(`${API_BASE}/settings/`);
}

export async function updateSettings(data) {
  return request(`${API_BASE}/settings/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Audit Logs ─────────────────────────────────────────
export async function fetchAuditLogs() {
  return request(`${API_BASE}/audit-logs/`);
}

export async function addAuditLog(message) {
  return request(`${API_BASE}/audit-logs/`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// ─── Profile ────────────────────────────────────────────
export async function fetchProfile() {
  return request(`${API_BASE}/users/me/`);
}

export async function updateProfile(data) {
  return request(`${API_BASE}/users/me/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Exit Interview Feedback ────────────────────────────
export async function submitExitInterview(resignationId, exitFeedback) {
  return request(`${API_BASE}/resignations/${resignationId}/feedback/`, {
    method: 'PATCH',
    body: JSON.stringify({ exitFeedback }),
  });
}

// ─── Dashboard Metrics ──────────────────────────────────
export async function fetchDashboardMetrics() {
  return request(`${API_BASE}/dashboard/metrics/`);
}

// ─── System Health ──────────────────────────────────────
export async function fetchSystemHealth() {
  return request(`${API_BASE}/system/health/`);
}

export async function fetchSystemHealthV1() {
  return request(`${API_BASE}/v1/system-health/`);
}

export async function fetchAdminAnalyticsSync(params = {}) {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      if (Array.isArray(params[key])) {
        params[key].forEach(val => query.append(`${key}[]`, val));
      } else {
        query.append(key, params[key]);
      }
    }
  });
  const queryString = query.toString();
  const url = `${API_BASE}/v1/admin/analytics/sync/${queryString ? `?${queryString}` : ''}`;
  return request(url);
}

// ─── Admin Audit Logs ───────────────────────────────────
export async function fetchAdminAuditLogs(params = {}) {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  const queryString = query.toString();
  const url = `${API_BASE}/v1/admin/audit-logs/${queryString ? `?${queryString}` : ''}`;
  return request(url);
}

export function getAuditLogsStreamUrl() {
  return `${API_BASE}/v1/admin/audit-logs/stream/`;
}

// ─── Analytics Individual Metrics ────────────────────────
export async function fetchPendingApprovals() {
  return request(`${API_BASE}/analytics/approvals/pending/`);
}

export async function fetchFailedLogins() {
  return request(`${API_BASE}/analytics/logins/failed/`);
}

export async function fetchHourlyActivity() {
  return request(`${API_BASE}/analytics/activity/hourly/`);
}

export async function fetchSystemUsageSnapshot() {
  return request(`${API_BASE}/v1/admin/analytics/system-usage/snapshot/`);
}

export function getSystemUsageStreamUrl() {
  return `${API_BASE}/v1/admin/analytics/system-usage/stream/`;
}

// ─── Asset Management ─────────────────────────────────────
// ─── Assets ─────────────────────────────────────────────
export async function fetchAssets() {
  return request(`${API_BASE}/assets/`);
}

export async function fetchAssetAuditTrail() {
  return request(`${API_BASE}/assets/audit/`);
}

export async function createAsset(data) {
  return request(`${API_BASE}/assets/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAssetStatus(id, status) {
  return request(`${API_BASE}/assets/${id}/maintenance/`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export async function assignAsset(id, email) {
  return request(`${API_BASE}/assets/${id}/assign/`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function returnAsset(id, data) {
  return request(`${API_BASE}/assets/${id}/return/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

    // ─── Reschedule Requests ─────────────────────────────────
    export async function createRescheduleRequest(data) {
      return request(`${API_BASE}/resignations/reschedule/`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    export async function fetchAssetDashboard() {
      return request(`${API_BASE}/assets/dashboard/`);
    }

    export async function fetchEmployees() {
      return request(`${API_BASE}/employees/`);
    }

    // ─── Exit Interview & Meetings API ───────────────────────
    export async function fetchExitInterviews(params = {}) {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.reason) query.append('reason', params.reason);
      if (params.department) query.append('department', params.department);
      if (params.ordering) query.append('ordering', params.ordering);
      const queryString = query.toString();
      return request(`${API_BASE}/exit-interviews/${queryString ? `?${queryString}` : ''}`);
    }

    export async function fetchLatestExitInterview() {
      return request(`${API_BASE}/exit-interviews/latest/`);
    }

    export async function fetchExitAnalytics() {
      return request(`${API_BASE}/exit-interviews/analytics/`);
    }

    export async function fetchMeetings() {
      return request(`${API_BASE}/meetings/`);
    }

    export async function createMeeting(data) {
      return request(`${API_BASE}/meetings/`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    export async function updateMeeting(id, data) {
      return request(`${API_BASE}/meetings/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    export async function deleteMeeting(id) {
      return request(`${API_BASE}/meetings/${id}/`, {
        method: 'DELETE',
      });
    }

    export async function fetchRescheduleRequests() {
      return request(`${API_BASE}/resignations/reschedule/list/`);
    }

    export async function decideRescheduleRequest(requestId, decision, comments = '') {
      return request(`${API_BASE}/resignations/reschedule/${requestId}/decision/`, {
        method: 'POST',
        body: JSON.stringify({ decision, rejection_reason: comments }),
      });
    }

    // ─── Notifications ──────────────────────────────────────
    export async function fetchNotifications() {
      return request(`${API_BASE}/notifications/`);
    }

    export async function markNotificationRead(id) {
      return request(`${API_BASE}/notifications/${id}/read/`, {
        method: 'POST',
      });
    }

    export async function markAllNotificationsRead() {
      return request(`${API_BASE}/notifications/read-all/`, {
        method: 'POST',
      });
    }

    // ─── Global Search ──────────────────────────────────────
    export async function searchGlobal(query) {
      return request(`${API_BASE}/search/?q=${encodeURIComponent(query)}`);
    }




