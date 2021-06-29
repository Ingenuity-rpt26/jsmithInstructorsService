/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import initialState from './initialState';
import Instructor from './Instructor.jsx';

const instructorsUrl = '54.176.19.199';
const imagesUrl = '54.176.19.199';

const Instructors = () => {
  const splitPath = window.location.pathname.split('/')[1];
  const course = splitPath || 1;
  const [courseNumber] = useState(course);
  const [instructorsData, setInstructorsData] = useState(initialState.instructorsData);
  const [primaryInstructorImage, setPrimaryInstructorImage] = useState('');
  const [additionalInstructorImages, setAdditionalInstructorImages] = useState([{ instructorId: 0, instructorImage: '' }]);
  const [label, setLabel] = useState('Instructor');
  const [svgs, setSvgs] = useState(initialState.svgs);
  // const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [gridClass, setGridClass] = useState('instructor-grid-small');
  const windowSizeGetter = () => {
    if (window.innerWidth <= 1040) {
      setGridClass('instructor-grid-small');
    } else if (window.innerWidth > 1040) {
      setGridClass('instructor-grid-large');
    }
  };
  // GET and set instructors data for this course as state
  useEffect(() => {
    windowSizeGetter();
    window.addEventListener('resize', windowSizeGetter);

    fetch(`http://${instructorsUrl}:3003/api/instructors/${courseNumber}`)
      .then((response) => response.json())
      .then((json) => {
        setInstructorsData(json);
        const newLabel = json.length > 1 ? 'Instructors' : 'Instructor';
        setLabel(newLabel);
      })
      .catch((err) => { if (err) { console.error(err); } });
    fetch(`http://${imagesUrl}:3006/api/image/${courseNumber}/primaryInstructor`)
      .then((response) => response.json())
      .then((json) => {
        setPrimaryInstructorImage(json.primaryInstructor);
      })
      .catch((err) => { if (err) { console.error(err); } });
    fetch(`http://${imagesUrl}:3006/api/image/${courseNumber}/additionalInstructors`)
      .then((response) => response.json())
      .then((json) => {
        setAdditionalInstructorImages(json.additionalInstructors);
      })
      .catch((err) => { if (err) { console.error(err); } });
    fetch(`http://${imagesUrl}:3006/api/svgs`)
      .then((response) => response.json())
      .then((json) => { setSvgs(json); })
      .catch((err) => { if (err) { console.error(err); } });

    const dice = 3;
    const sides = 6;
    const query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;

    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { dice, sides },
      }),
    })
      .then((r) => r.json())
      .then((data) => console.log('data returned:', data));
  }, []);

  return (
    <div className="instructors">
      <div className="instructor-label">
        {label}
      </div>
      <span className="instructors-rating">
        {'Instructor rating '}
        <span>
          <svg className="instructors-svg" viewBox="0 0 90 90">
            <path d={svgs.instructorSVG} />
          </svg>
        </span>
        <span className="instructors-ratings">
          {`${instructorsData[0].instructorAverageRating}/5 (${instructorsData[0].numberOfRatings} Ratings)`}
        </span>
        <span>
          <svg className="instructors-infoSVG" viewBox="0 0 80 80" height="30px" width="30px">
            <path d={svgs.infoSVG.i} />
            <path d={svgs.infoSVG.dot} />
            <polygon points={svgs.infoSVG.circle} />
          </svg>
        </span>
      </span>
      <div className="instructor-grid" id={gridClass}>
        {instructorsData.map((instructor, index) => {
        // set image while mapping, pass as props
          let isPrimary = false;
          let image = primaryInstructorImage;
          // is instructor primary?
          for (let i = 0; i < instructor.courses.length; i++) {
            if (instructor.courses[i].courseNumber === courseNumber) {
              isPrimary = true;
            }
          }
          // if instructor is not primary, find and set image in additionalInstructors
          if (!isPrimary) {
            for (let i = 0; i < additionalInstructorImages.length; i++) {
              if (instructor.id === additionalInstructorImages[i].instructorId) {
                image = additionalInstructorImages[i].instructorImage;
                break;
              }
            }
          }
          return <Instructor key={'instructor'.concat(index)} image={image} instructor={instructor} svgs={svgs} courseNumber={courseNumber} />;
        })}
      </div>
    </div>
  );
};

export default Instructors;
