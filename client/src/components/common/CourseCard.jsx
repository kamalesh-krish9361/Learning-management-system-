import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CourseCard = ({ course, isEnrolled = false, userProgress = 0 }) => {
  const { user, toggleWishlist } = useAuth();
  const isWishlisted = user?.wishlistCourseIds?.includes(course.id);

  const getLevelBadge = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-card-hover hover:border-violet-300 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(course.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Category & Level Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
            {course.category}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getLevelBadge(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{course.rating?.toFixed(1) || '4.9'}</span>
            <span className="text-slate-400 font-normal">({course.reviewsCount || 0})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span>{course.enrolledCount?.toLocaleString() || 0} students</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <Link to={`/courses/${course.id}`} className="block group-hover:text-violet-700 transition-colors">
          <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
            {course.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {course.subtitle || course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
          <img
            src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
            alt={course.instructor?.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span className="text-xs font-semibold text-slate-700 truncate">
            {course.instructor?.name}
          </span>
        </div>

        {/* Course Meta: Lessons & Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            {course.totalLessons || 20} lessons
          </span>
        </div>

        {/* Progress Bar (if enrolled) or Price + CTA */}
        {isEnrolled ? (
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Your Progress</span>
              <span className="text-violet-700">{userProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-600 to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${userProgress}%` }}
              ></div>
            </div>
            <Link
              to={`/learn/${course.id}`}
              className="mt-2 w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-glow-violet transition-all"
            >
              <span>{userProgress === 100 ? 'Review Course' : 'Continue Learning'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1 mt-auto">
            <div>
              {course.isFree || course.price === 0 ? (
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  FREE
                </span>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900">${course.price}</span>
                  {course.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">${course.originalPrice}</span>
                  )}
                </div>
              )}
            </div>

            <Link
              to={`/courses/${course.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-gradient-to-r hover:from-violet-600 hover:to-amber-500 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
