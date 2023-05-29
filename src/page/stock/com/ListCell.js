import { locationsSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

export default function ListCell({
    num = 10,
    size = 5,
    countFrom = 1,
    row = true,
    areaName,
    lineNumber,

    openModal = () => {},
}) {
    const locations = useSelector(locationsSelector);

    return (
        <div {...(row ? { className: 'flex' } : {})}>
            {new Array(num).fill(0).map((i, index) => {
                const numberString = ('0' + (countFrom + index)).slice(-2);

                return (
                    <Cell
                        onClick={() => openModal(numberString)}
                        className='center'
                        key={index + ''}
                        height={`${size}vh`}
                        status={
                            locations?.find(
                                (item) => item.name === `${areaName}-${lineNumber}-${numberString}`
                            )?.status
                        }
                    >
                        {numberString}
                    </Cell>
                );
            })}
        </div>
    );
}

const Cell = styled.div`
    height: ${(props) => props.height};
    width: ${(props) => props.height};
    border: 1px solid red;
    font-weight: 500;

    color: ${(props) => props.status && 'white'};
    background: ${(props) =>
        props.status === 'pending'
            ? '#c0ca33'
            : props.status === 'unavailable'
            ? 'red'
            : props.status === 'available'
            ? 'green'
            : ''};

    &:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
            rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
            rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
            rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
            rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    }
`;
