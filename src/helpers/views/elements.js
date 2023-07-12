import React from "react";


export const DescriptionItem = ({ title, content , style={}, title_style={}}) => (


    <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
          ...style
        }}
    >
      <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
            ...title_style
          }}
      >
        {title}:
      </p>
      {content}
    </div>
);