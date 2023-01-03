/**
 * "react-sortation"
 * Version: 0.5.0
 * License: MIT
 * Author: Dan Michael <dan@danmichael.consulting>, started mid 2022
 * 
 * Requirements: For ReactJS running in web browsers, with 2 installed dependencies.
 * 
 * Use this to sort any array of objects or values
 * 
 * Thank you for using this!
 * 
 * 
 * Steps to use:
 * 1. Wrap your app in <RecoilRoot>
 */

/**Import & Initialize dependencies (2) */
//
import { useEffect, useCallback } from 'react'
import { atomFamily, useRecoilState } from 'recoil'
const packageName = 'react-sortation'
//

const defaultColumnSortState = {
    sortBy: null,
    direction: 'asc',
    passthrough: val => val
}

const columnSortState = atomFamily({
    key: packageName+':ColumnSortStage',
    default: defaultColumnSortState
})

const useSortation = (tableKey = '', options = {}) => {
    const [state, setState] = useRecoilState(columnSortState(tableKey))
    
    const setOnClick = (objectPropertyToSortColumnBy = defaultColumnSortState.sortBy, passthrough = null) => (() => setState(
        state.sortBy !== objectPropertyToSortColumnBy? 
            {...state, sortBy: objectPropertyToSortColumnBy, ...passthrough? {passthrough} : {passthrough: defaultColumnSortState.passthrough}}
            : {...state, direction: state.direction === 'asc'? 'desc' : 'asc', ...passthrough? {passthrough} : {passthrough: defaultColumnSortState.passthrough}}
    ))

    const sortFunc = useCallback((obj1, obj2) => 
        !state.sortBy || state.passthrough(obj1[state.sortBy]) === state.passthrough(obj2[state.sortBy])? 0
        : state.direction === 'asc'? 
            state.passthrough(obj1[state.sortBy]) < state.passthrough(obj2[state.sortBy])? -1 : 1
        : state.passthrough(obj1[state.sortBy]) > state.passthrough(obj2[state.sortBy])? -1 : 1,
    [state.sortBy, state.direction])
    //
    const sort = (objs = []) => objs.sort(sortFunc)

    const directionArrow = <span className='noselect' style={{color: 'var(--cstone-hyperlink-color)', display: 'inline-block', position: 'relative', transform: `rotate(${state.direction === 'asc'? -90 : 90}deg)`, top: `calc(${state.direction === 'asc'? 1 : 2} * var(--letter-spacing))`}}>&#10140;</span>

    const th = (objectPropertyToSortColumnBy = null, options = {}) => 
        <th key={`tableSorter:${tableKey}:${objectPropertyToSortColumnBy}`}
            title={options.title || null} 
            className={options.className || ''} 
            style={{cursor: 'pointer', ...options.style || {}}} 
            onClick={setOnClick(objectPropertyToSortColumnBy, options.passthrough || null)}
            >
            {options.title || `${objectPropertyToSortColumnBy.toString().slice(0, 1).toUpperCase()}${objectPropertyToSortColumnBy.toString().slice(1)}` || '?'}&nbsp;<span style={state.sortBy === objectPropertyToSortColumnBy? {} : {visibility: 'hidden', pointerEvents: 'none'}}>{directionArrow}</span>
        </th>

    /**Check initially for preferred sortBy */
    useEffect(() => (options.defaultSortBy || false) && !state.sortBy && setState({...state, sortBy: options.defaultSortBy}), [])
    
    return {
        state,
        setState,
        directionArrow,
        setOnClick,
        sortFunc,
        sort,
        th
    }
}
    
export default useSortation