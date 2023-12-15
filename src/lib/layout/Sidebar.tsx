import React, { Component, FC } from 'react'

import { _get, arraysEqual } from '../utility/generic'
import {
  ReactCalendarGroupRendererProps,
  TimelineGroupBase,
  TimelineKeys,
} from '../types/main'

type Props<CustomGroup extends TimelineGroupBase = TimelineGroupBase> = {
  groups: CustomGroup[]
  width: number
  height: number
  groupHeights: number[]
  keys: TimelineKeys
  groupRenderer?: FC<ReactCalendarGroupRendererProps> //TODO Check
  isRightSidebar: boolean
}

export default class Sidebar extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    )
  }

  renderGroupContent(
    group: TimelineGroupBase,
    isRightSidebar: boolean,
    groupTitleKey: string,
    groupRightTitleKey: string,
  ) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar,
      })
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
    }
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`,
    }

    const groupsStyle = {
      width: `${width}px`,
    }

    const groupLines = this.props.groups.map((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index]}px`,
        lineHeight: `${groupHeights[index]}px`,
      }

      return (
        <div
          key={_get(group, groupIdKey)}
          className={
            'rct-sidebar-row rct-sidebar-row-' +
            (index % 2 === 0 ? 'even' : 'odd')
          }
          style={elementStyle}
        >
          {this.renderGroupContent(
            group,
            isRightSidebar,
            groupTitleKey,
            groupRightTitleKey,
          )}
        </div>
      )
    })

    return (
      <div
        className={'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : '')}
        style={sidebarStyle}
      >
        <div style={groupsStyle}>{groupLines}</div>
      </div>
    )
  }
}
