import React, { useState, useEffect } from 'react';
import { Search, Star, Bookmark, Eye, X, BookmarkX, Users, TrendingUp } from 'lucide-react';

const Bookmarks = ({ onNavigate }) => {
  const [bookmarkedEmployees, setBookmarkedEmployees] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [promotedUser, setPromotedUser] = useState(null);

  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem('bookmarkedEmployees');
        const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
        setBookmarkedEmployees(bookmarks);
        setFilteredBookmarks(bookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        setBookmarkedEmployees([]);
        setFilteredBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();

    const handleBookmarkChange = () => {
      loadBookmarks();
    };

    window.addEventListener('bookmarksChanged', handleBookmarkChange);
    
    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarkChange);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBookmarks(bookmarkedEmployees);
    } else {
      const filtered = bookmarkedEmployees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = employee.email.toLowerCase();
        const department = employee.company?.department?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               department.includes(searchLower);
      });
      setFilteredBookmarks(filtered);
    }
  }, [searchTerm, bookmarkedEmployees]);

  const removeBookmark = (employeeId) => {
    try {
      const updatedBookmarks = bookmarkedEmployees.filter(emp => emp.id !== employeeId);
      
      localStorage.setItem('bookmarkedEmployees', JSON.stringify(updatedBookmarks));
      
      setBookmarkedEmployees(updatedBookmarks);
      
      window.dispatchEvent(new CustomEvent('bookmarksChanged'));
      
      console.log('Bookmark removed successfully');
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handlePromote = (user) => {
    setPromotedUser(user);
    setTimeout(() => setPromotedUser(null), 3000);
  };

  const handleView = (employeeId) => {
    if (onNavigate) {
      onNavigate('employees', { employeeId });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          ({rating}/5)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
     
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Bookmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarked Employees
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {bookmarkedEmployees.length} employee{bookmarkedEmployees.length !== 1 ? 's' : ''} bookmarked
        </p>
      </div>

      {bookmarkedEmployees.length > 0 && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookmarked employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
            
            {searchTerm && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredBookmarks.length} of {bookmarkedEmployees.length} bookmarked employees
                </p>
              </div>
            )}
          </div>

          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBookmarks.map(employee => (
                <div
                  key={employee.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={employee.image}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Age: {employee.age}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBookmark(employee.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      📧 {employee.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🏢 {employee.company?.department || 'No Department'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Performance Rating
                    </p>
                    {renderStars(employee.rating)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(employee.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handlePromote(employee)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Promote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No matching bookmarks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}

      {bookmarkedEmployees.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <Users className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start bookmarking employees from the dashboard to keep track of important team members.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors font-medium"
          >
            <Bookmark className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>
        </div>
      )}
      {promotedUser && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
          <p className="font-medium">
            🎉 {promotedUser.firstName} {promotedUser.lastName} has been promoted!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Bookmarks;