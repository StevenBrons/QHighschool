import React, { Component } from 'react';
import './Page.css';
import CourseInfo from './components/CourseInfo';
import CourseGroup from './components/CourseGroup';
import Header from './components/Header';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOut: null,
    }
  }

  onClick = (course, group) => {
    let popOut = this.state.popOut;
    if (popOut && popOut.group === group && popOut.course === course) {
      popOut = null;
    } else {
      popOut = {
        group: group,
        course: course,
      }
    }
    this.setState({
      popOut: popOut,
    })
  }

  render() {
    const popOut = this.state.popOut;
    return (
      <div className='Page'>
        <Header />
        {['Wiskunde D', 'Wiskunde C', 'Avonturen', 'Informatica', 'Spaans'].map(group =>
          <>
            <CourseGroup 
              title={group} 
              onClick={course => this.onClick(course,group)} 
              className='course-group' 
              large = {group === 'Avonturen'}
            />
            {popOut && popOut.group === group && 
              <CourseInfo 
                course={popOut.course} 
                group={group} 
                onClose={_ => this.onClick(popOut.course, popOut.group)} 
              />  
            }
          </>
        )}
      </div>
    )
  }
}

export default Page;
