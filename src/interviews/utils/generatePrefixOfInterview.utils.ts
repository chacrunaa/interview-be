export const generatePrefixOfInterview = ({maxoffer, minoffer}:{maxoffer: number, minoffer: number}) => {
    let prefix = null;
    if(maxoffer && !minoffer) {
        prefix = 'до';
    }
    if(!maxoffer && minoffer) {
        prefix = 'от';
    }
    return prefix
}