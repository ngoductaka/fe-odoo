import styled from 'styled-components';

export default function LineNameWrapper({
    lineNumber,
    renderComponent = () => {},
    position = 'left',
}) {
    return (
        <Box>
            <p className={`name center ${position}`}>{lineNumber}</p>

            {renderComponent(lineNumber)}
        </Box>
    );
}

const Box = styled.div`
    position: relative;

    & .name {
        position: absolute;

        width: 42px;
        height: 42px;

        border-radius: 50%;
        border: 2px solid green;

        font-size: 18px;
        font-weight: 500;
        background-color: #e2ffe2;
    }

    & .name.left {
        top: 50%;
        left: -60px;
        transform: translateY(-50%);
    }

    & .name.bottom {
        left: 40%;
        bottom: -66px;
    }

    & .name.centerXY {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;
