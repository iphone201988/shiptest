import React from "react";


export const DescriptionView = ({ title, content , style={}, title_style={}}) => (


    <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          display: 'flex',
          width:"30%",
          justifyContent:'space-between' ,
          color: 'rgba(0,0,0,0.65)',
          ...style
        }}
    >
      <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            marginRight:"70px",
            color: 'rgba(0,0,0,0.85)',
            ...title_style
          }}
      >
        {title}
      </p>
      {content}
    </div>
);
// element.style {
//     font-size: 14px;
//     line-height: 22px;
//     margin-bottom: 7px;
//     display: flex;
//     color: rgba(0, 0, 0, 0.65);
//     justify-content: space-between;
//     width: 30%;
// }