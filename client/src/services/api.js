const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auralms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateProfile: async (updates) => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      return handleResponse(res);
    },
    toggleWishlist: async (courseId) => {
      const res = await fetch(`${BASE_URL}/auth/wishlist/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getDemoAccounts: async () => {
      const res = await fetch(`${BASE_URL}/auth/demo-accounts`);
      return handleResponse(res);
    }
  },

  // Courses
  courses: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/courses${query ? `?${query}` : ''}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/courses/${id}`);
      return handleResponse(res);
    },
    getCategories: async () => {
      const res = await fetch(`${BASE_URL}/courses/categories`);
      return handleResponse(res);
    },
    create: async (courseData) => {
      const res = await fetch(`${BASE_URL}/courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
      });
      return handleResponse(res);
    },
    update: async (id, courseData) => {
      const res = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    addReview: async (courseId, reviewData) => {
      const res = await fetch(`${BASE_URL}/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      return handleResponse(res);
    }
  },

  // Enrollments & Progress
  enrollments: {
    getMyEnrollments: async () => {
      const res = await fetch(`${BASE_URL}/enrollments/my-enrollments`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    checkEnrollment: async (courseId) => {
      const res = await fetch(`${BASE_URL}/enrollments/check/${courseId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    enroll: async (courseId) => {
      const res = await fetch(`${BASE_URL}/enrollments/enroll/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateProgress: async (courseId, lessonId, completed) => {
      const res = await fetch(`${BASE_URL}/enrollments/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ courseId, lessonId, completed })
      });
      return handleResponse(res);
    },
    getCertificate: async (courseId) => {
      const res = await fetch(`${BASE_URL}/enrollments/certificate/${courseId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Quizzes
  quizzes: {
    getByCourse: async (courseId) => {
      const res = await fetch(`${BASE_URL}/quizzes/course/${courseId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    submit: async (courseId, answers) => {
      const res = await fetch(`${BASE_URL}/quizzes/submit/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers })
      });
      return handleResponse(res);
    },
    getMyHistory: async () => {
      const res = await fetch(`${BASE_URL}/quizzes/my-history`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Instructor
  instructor: {
    getOverview: async () => {
      const res = await fetch(`${BASE_URL}/instructor/overview`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    gradeAssignment: async (assignmentId, submissionId, grade, feedback) => {
      const res = await fetch(`${BASE_URL}/instructor/assignments/${assignmentId}/grade/${submissionId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ grade, feedback })
      });
      return handleResponse(res);
    }
  },

  // Admin
  admin: {
    getOverview: async () => {
      const res = await fetch(`${BASE_URL}/admin/overview`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getUsers: async () => {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateUser: async (id, data) => {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteUser: async (id) => {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    createCategory: async (data) => {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteCategory: async (id) => {
      const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Discussions
  discussions: {
    getForCourse: async (courseId, lessonId) => {
      const url = `${BASE_URL}/discussions/${courseId}${lessonId ? `?lessonId=${lessonId}` : ''}`;
      const res = await fetch(url);
      return handleResponse(res);
    },
    create: async (courseId, data) => {
      const res = await fetch(`${BASE_URL}/discussions/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    reply: async (courseId, discussionId, message) => {
      const res = await fetch(`${BASE_URL}/discussions/${courseId}/${discussionId}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message })
      });
      return handleResponse(res);
    }
  }
};
