export const generatePrefixOfInterview = ({maxoffer, minoffer}:{maxoffer: number, minoffer: number}) => {
    let prefix = null;
    if(maxoffer && !minoffer) {
        prefix = 'До';
    }
    if(!maxoffer && minoffer) {
        prefix = 'От';
    }
    return prefix
}