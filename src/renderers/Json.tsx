import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';

import JSONTree from 'react-json-tree';
import {autobind} from '../utils/helper';

export interface JSONProps extends RendererProps {
  className?: string;
  placeholder?: string;
  levelExpand: number;
  jsonTheme: string;
}

const twilight = {
  scheme: 'twilight',
  author: 'david hart (http://hart-dev.com)',
  base00: '#1e1e1e',
  base01: '#323537',
  base02: '#464b50',
  base03: '#5f5a60',
  base04: '#838184',
  base05: '#a7a7a7',
  base06: '#c3c3c3',
  base07: '#ffffff',
  base08: '#cf6a4c',
  base09: '#cda869',
  base0A: '#f9ee98',
  base0B: '#8f9d6a',
  base0C: '#afc4db',
  base0D: '#7587a6',
  base0E: '#9b859d',
  base0F: '#9b703f',
  tree: {
    border: 0,
    padding: '0 0.625em 0.425em',
    marginTop: '-0.25em',
    marginBottom: '0',
    marginLeft: '0',
    marginRight: 0,
    listStyle: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    width: '100%'
  }
};

const eighties = {
  scheme: 'eighties',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#2d2d2d',
  base01: '#393939',
  base02: '#515151',
  base03: '#747369',
  base04: '#a09f93',
  base05: '#d3d0c8',
  base06: '#e8e6df',
  base07: '#f2f0ec',
  base08: '#f2777a',
  base09: '#f99157',
  base0A: '#ffcc66',
  base0B: '#99cc99',
  base0C: '#66cccc',
  base0D: '#6699cc',
  base0E: '#cc99cc',
  base0F: '#d27b53',
  tree: {
    border: 0,
    padding: '0 0.625em 0.425em',
    marginTop: '-0.25em',
    marginBottom: '0',
    marginLeft: '0',
    marginRight: 0,
    listStyle: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    backgroundColor: '#2D2D2D',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    width: '100%'
  }
};

const themes: any = {
  twilight,
  eighties
};

export class JSONField extends React.Component<JSONProps, object> {
  static defaultProps: Partial<JSONProps> = {
    placeholder: '-',
    levelExpand: 1,
    jsonTheme: 'twilight'
  };

  @autobind
  valueRenderer(raw: any) {
    const cx = this.props.classnames;
    if (typeof raw === 'string' && /^\"?https?:\/\//.test(raw)) {
      return (
        <a
          className={cx('JsonField-nodeValue')}
          href={raw.replace(/^\"(.*)\"$/, '$1')}
          target="_blank"
        >
          {raw}
        </a>
      );
    }
    return <span className={cx('JsonField-nodeValue')}>{raw}</span>;
  }

  shouldExpandNode = (keyName: any, data: any, level: any) => {
    const {levelExpand} = this.props;
    return level < levelExpand;
  };

  render() {
    const {className, value, jsonTheme, classnames: cx} = this.props;

    let data = value;

    if (typeof value === 'string') {
      try {
        data = JSON.parse(value);
      } catch (e) {
        data = {
          error: e.message
        };
      }
    }

    const theme = themes[jsonTheme] ? themes[jsonTheme] : themes['twilight'];

    return (
      <div className={cx('JsonField', className)}>
        <JSONTree
          data={data}
          theme={theme}
          shouldExpandNode={this.shouldExpandNode}
          valueRenderer={this.valueRenderer}
        />
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)json$/,
  name: 'json'
})
export class JSONFieldRenderer extends JSONField {}
