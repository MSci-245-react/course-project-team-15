const serverURL = "";

export const unfollowUser = async (userId) => {
    try {
      const response = await fetch(`${serverURL}/api/unfollowUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.toString() };
    }
  };