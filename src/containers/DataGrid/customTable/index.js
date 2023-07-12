import React, { Component } from "react";
import Table from 'components/uielements/table';
import { Resizable } from 'react-resizable';
import { injectIntl, intlShape } from "react-intl";
import TableStyle from './table.style';
import ToogleButton from 'containers/Topbar/toggleButton'

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

class CustomTable extends Component {

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    INITIAL_STATE = {
        columns: [],
    }

    constructor(props) {
        super(props);
        this.state = { columns: this.props.columns || [] }
    }

    componentDidMount() {
        console.log(this.props, "this.props")
        if (this.props.columns) {
            this.setState({ columns: this.props.columns })
        }
    }

    componentDidUpdate(prevProps) {
    }

    // handleResize = index => (e, { size }) => {
    //     this.setState(({ columns }) => {
    //         const nextColumns = [...columns];
    //         nextColumns[index] = {
    //             ...nextColumns[index],
    //             // width: `${Math.max(size.width, 100)}px;`,
    //         };
    //         return { columns: nextColumns };
    //     });
    // };

    onChange = (pagination, filters, sorter) => {
        const { onChange } = this.props
        if (onChange) {
            onChange(pagination, filters, sorter)
        }

    }

    render() {

        const { loading, pagination, dataSource, columns } = this.props
        const className = this.props.className;

        return (
            <>
             
                <TableStyle>
                    <Table
                        rowSelection={this.props.rowSelection}
                        components={this.components}
                        loading={loading}
                        onChange={this.onChange}
                        pagination={pagination}
                        columns={columns}
                        dataSource={dataSource}
                        className={className}
                        
                    />
                </TableStyle>
            </>
        )
    }
}

CustomTable.propTypes = {
    intl: intlShape.isRequired
}


export default injectIntl(CustomTable);