import React, { useState } from 'react'

import Tooltip from '@mui/material/Tooltip'
import HexagonInfoTooltipMessages from './HexagonInfoTooltipMessages'

import { HexagonRendererState } from '@entityTypes/hexaQuest'

type AdditionalHexagonInfoTooltipProps = {
    rendererState: HexagonRendererState
}

export type HexagonInfoTooltipProps = AdditionalHexagonInfoTooltipProps & React.SVGProps<SVGGElement>

const HexagonInfoTooltip = ({ rendererState, ...props }: HexagonInfoTooltipProps) => {
    const [shouldShowTooltip, setShouldShowTooltip] = useState(false)

    const onTooltipOpen = () => {
        setShouldShowTooltip(true)
    }

    const onTooltipClose = () => {
        setShouldShowTooltip(false)
    }

    return (
        <Tooltip
            onOpen={onTooltipOpen}
            onClose={onTooltipClose}
            disableInteractive={true}
            title={shouldShowTooltip ? <HexagonInfoTooltipMessages rendererState={rendererState} /> : null}
        >
            <g>{props.children}</g>
        </Tooltip>
    )
}

export default HexagonInfoTooltip
