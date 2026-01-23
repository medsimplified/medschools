import { useEffect, useState } from "react";
import { Rating } from 'react-simple-star-rating';

const CourseSidebar = ({ setCourses, allCourses }: any) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [showMoreSubject, setShowMoreSubject] = useState(false);
  const [showMoreInstructor, setShowMoreInstructor] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState('');
  const [instructorSelected, setInstructorSelected] = useState('');
  const [ratingSelected, setRatingSelected] = useState<number | null>(null);

  // Fetch subjects (categories) from API
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setSubjects(data || []))
      .catch(() => setSubjects([]));
  }, []);

  // Fetch instructors from API
  useEffect(() => {
    fetch('/api/instructors')
      .then(res => res.json())
      .then(data => setInstructors(data || []))
      .catch(() => setInstructors([]));
  }, []);

  // Handle subject selection
  const handleSubject = (subject: string) => {
    const newSubject = subject === subjectSelected ? '' : subject;
    setSubjectSelected(newSubject);
    filterCourses({ subject: newSubject, instructor: instructorSelected, rating: ratingSelected });
  };

  // Handle Instructor selection
  const handleInstructor = (instructor: string) => {
    const newInstructor = instructor === instructorSelected ? '' : instructor;
    setInstructorSelected(newInstructor);
    filterCourses({ subject: subjectSelected, instructor: newInstructor, rating: ratingSelected });
  };

  // Handle rating selection
  const handleRating = (rating: number) => {
    const newRating = rating === ratingSelected ? null : rating;
    setRatingSelected(newRating);
    filterCourses({ subject: subjectSelected, instructor: instructorSelected, rating: newRating });
  };

  // Filter courses based on selected criteria
  const filterCourses = ({ subject, instructor, rating }: any) => {
    let filteredCourses = allCourses;
    if (subject) filteredCourses = filteredCourses.filter((course: any) => course.category === subject);
    if (instructor) filteredCourses = filteredCourses.filter((course: any) => course.instructors === instructor);
    if (rating) filteredCourses = filteredCourses.filter((course: any) => course.rating >= rating);
    setCourses(filteredCourses);
  };

  const subjectsToShow = showMoreSubject ? subjects : subjects.slice(0, 8);
  const instructorToShow = showMoreInstructor ? instructors : instructors.slice(0, 4);

  return (
    <div className="col-xl-3 col-lg-4">
      <aside className="sidebar-brand">
        <div className="sidebar-widget">
          <h4 className="sidebar-title">Courses</h4>
          <ul className="sidebar-list">
            {subjectsToShow.map((subject: any, i: any) => (
              <li key={i}>
                <div
                  onClick={() => handleSubject(subject)}
                  className={`sidebar-card${subject === subjectSelected ? " selected" : ""}`}
                >
                  <input className="sidebar-check" type="checkbox" checked={subject === subjectSelected} readOnly id={`subject_${i}`} />
                  <label className="sidebar-label" htmlFor={`subject_${i}`} onClick={() => handleSubject(subject)}>{subject}</label>
                </div>
              </li>
            ))}
          </ul>
          {subjects.length > 8 && (
            <div className="sidebar-more">
              <a className={`sidebar-more-btn ${showMoreSubject ? 'active' : ''}`} style={{ cursor: "pointer" }} onClick={() => setShowMoreSubject(!showMoreSubject)}>
                {showMoreSubject ? "Show Less -" : "Show More +"}
              </a>
            </div>
          )}
        </div>
        <div className="sidebar-widget">
          <h4 className="sidebar-title">Instructors</h4>
          <ul className="sidebar-list">
            {instructorToShow.map((instructor: any, i: any) => (
              <li key={i}>
                <div
                  onClick={() => handleInstructor(instructor)}
                  className={`sidebar-card${instructor === instructorSelected ? " selected" : ""}`}
                >
                  <input className="sidebar-check" type="checkbox" checked={instructor === instructorSelected} readOnly id={`instructor_${i}`} />
                  <label className="sidebar-label" htmlFor={`instructor_${i}`} onClick={() => handleInstructor(instructor)}>{instructor}</label>
                </div>
              </li>
            ))}
          </ul>
          {instructors.length > 4 && (
            <div className="sidebar-more">
              <a className={`sidebar-more-btn ${showMoreInstructor ? 'active' : ''}`} style={{ cursor: "pointer" }} onClick={() => setShowMoreInstructor(!showMoreInstructor)}>
                {showMoreInstructor ? "Show Less -" : "Show More +"}
              </a>
            </div>
          )}
        </div>
        <style jsx>{`
          .sidebar-brand {
            background: #0d447a;
            border-radius: 0 18px 18px 0;
            padding: 0;
            min-width: 260px;
            max-width: 320px;
            position: sticky;
            top: 100px;
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: 100%;
          }
          .sidebar-widget {
            margin: 0;
            padding: 18px 0 0 0;
          }
          .sidebar-title {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 10px;
            padding-left: 24px;
            letter-spacing: 0.2px;
            text-align: left;
          }
          .sidebar-list {
            list-style: none;
            padding: 0 18px;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .sidebar-card {
            display: flex;
            align-items: center;
            padding: 0 12px;
            border-radius: 10px;
            background: rgba(255,255,255,0.18);
            cursor: pointer;
            transition: box-shadow 0.18s, background 0.18s;
            position: relative;
            box-shadow: 0 1px 4px rgba(13,68,122,0.04);
            gap: 10px;
            min-height: 38px;
          }
          .sidebar-card.selected {
            border: 2px solid #5dba47;
            background: rgba(93,186,71,0.18);
            box-shadow: 0 2px 8px #5dba4740;
          }
          .sidebar-card:hover {
            background: rgba(227,246,253,0.38);
          }
          .sidebar-check {
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            margin-right: 10px;
            background: transparent;
            cursor: pointer;
            transition: all 0.18s;
            flex-shrink: 0;
          }
          .sidebar-check:checked {
            background: linear-gradient(135deg, #0d447a 0%, #5dba47 100%);
            border-color: #0d447a;
          }
          .sidebar-label {
            color: #0d447a;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            letter-spacing: 0.05px;
            flex-grow: 1;
            transition: color 0.18s;
            text-align: left;
          }
          .sidebar-card.selected .sidebar-label {
            color: #5dba47;
          }
          .sidebar-more {
            margin-top: 6px;
            text-align: left;
            padding-left: 18px;
          }
          .sidebar-more-btn {
            color: #5dba47;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            padding: 6px 14px;
            border: 1.5px solid #5dba47;
            border-radius: 14px;
            background: transparent;
            transition: all 0.18s;
            display: inline-block;
            letter-spacing: 0.1px;
          }
          .sidebar-more-btn:hover,
          .sidebar-more-btn.active {
            background: linear-gradient(135deg, #5dba47 0%, #0d447a 100%);
            color: white;
            border-color: #5dba47;
          }
          @media (max-width: 768px) {
            .sidebar-brand {
              min-width: 100%;
              max-width: 100%;
              border-radius: 0;
            }
            .sidebar-title {
              font-size: 1rem;
              padding-left: 8px;
            }
            .sidebar-list {
              padding: 0 8px;
            }
            .sidebar-card {
              padding: 0 6px;
            }
            .sidebar-label {
              font-size: 13px;
            }
          }
        `}</style>
      </aside>
    </div>
  );
}

export default CourseSidebar;
