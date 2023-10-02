// export interface Transaction{
//     Date?: string | undefined;
//     Narration?: string | undefined;
//     RefNo?: string | undefined;
//     ValueDate?: string | undefined;
//     WithdrawalAmount?: number | undefined;
//     ClosingBalance?: number | undefined;
// };

export interface Transaction {
    Date: string;
    Narration: string;
    'Chq./Ref.No.': string;
    'Value Dt': string;
    'Withdrawal Amt.': number;
    'Closing Balance': number;
  }