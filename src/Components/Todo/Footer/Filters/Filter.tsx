import React from 'react'

import classes from './Filter.module.css'

const Filter: React.FC<ITodoFilterProps> = (props) => {
    return (
        <li className={classes.FiltersItem} onClick={props.clicked} style={{borderColor: props.selected ? 'rgba(175, 47, 47, 0.2)' : 'rgba(175, 47, 47, 0.08)'}}>
            {props.children}
        </li>
    )
}

export default Filter;