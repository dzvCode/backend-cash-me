import { OmitType, PartialType } from "@nestjs/swagger";
import { Transaction } from "../models/transaction.model";

export class UpdateTransactionDto extends PartialType(OmitType(Transaction, ['initiatorCode', 'amount', 'operationType', 'location'] as const)) { }