export const spans = {
    xsmall: {xs: 8, sm:6, md:4, lg:3, xl: 2},
    small: {xs: 12, sm:8, md:6, lg:4, xl: 4},
    medium: {xs: 24, sm:{span: 12}, md:{span: 8}, lg:{span: 6}, xl: 6},
    large: {xs: 24, sm:{span: 24}, md:{span: 12}, lg:{span: 10}, xl: 10},
    xlarge: {xs: 24, sm:{span: 24}, md:16, lg:14, xl: 16},
    xxlarge: {xs: 24, sm:{span: 24}, md:{span: 24}, lg:{span: 18}, xl: 16},
    full:{xs: 24, sm:{span: 24}, md:{span: 24}, lg:{span: 24}, xl: 24}
}


const SPANS = {
    24: {xs:{span: 24}, sm:{span: 24}, md:{span: 24}, lg:{span: 24}, xl:{span: 24}},
    22: {xs:{span: 24}, sm:{span: 24}, md:{span: 24}, lg:{span: 24}, xl:{span: 22}},
    20: {xs:{span: 24}, sm:{span: 24}, md:{span: 24}, lg:{span: 22}, xl:{span: 20}},
    18: {xs:{span: 24}, sm:{span: 24}, md:{span: 22}, lg:{span: 20}, xl:{span: 18}},
    16: {xs:{span: 24}, sm:{span: 22}, md:{span: 20}, lg:{span: 18}, xl:{span: 16}},
    14: {xs:{span: 22}, sm:{span: 20}, md:{span: 18}, lg:{span: 16}, xl:{span: 14}},
    12: {xs:{span: 20}, sm:{span: 18}, md:{span: 16}, lg:{span: 14}, xl:{span: 12}},
    10: {xs:{span: 18}, sm:{span: 16}, md:{span: 14}, lg:{span: 12}, xl:{span: 10}},
    8: {xs:{span: 16}, sm:{span: 14}, md:{span: 12}, lg:{span: 10}, xl:{span: 8}},
    6: {xs:{span: 14}, sm:{span: 12}, md:{span: 10}, lg:{span: 8}, xl:{span: 6}},
    4: {xs:{span: 12}, sm:{span: 10}, md:{span: 8}, lg:{span: 6}, xl:{span: 4}},
    2: {xs:{span: 10}, sm:{span: 8}, md:{span: 6}, lg:{span: 4}, xl:{span: 2}},

}

export function getSpan(size){
    const span = SPANS[size] !== undefined ?  SPANS[size] : SPANS[24]
    return span
}

