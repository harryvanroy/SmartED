import React from 'react';

const classifier = ({ V, A, R, K }) => {
    if (V > 0.5) {
        return (
            <div>
                Vis
            </div>
        )
    } else if (A > 0.5) {
        return (
            <div>
                Audio
            </div>
        )
    } else if (R > 0.5) {
        return (
            <div>
                Read write
            </div>
        )
    } else if (K > 0.5) {
        return (
            <div>
                Kin
            </div>
        )
    } else {
        return (
            <div>
                multi
            </div>
        )
    }
}

const VarkBreakdown = (V, A, R, K) => {
    return (
        <div>
            {classifier(V, A, R, K)}
        </div>
    )
}

export default VarkBreakdown;