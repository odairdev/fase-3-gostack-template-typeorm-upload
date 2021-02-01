import AppError from '../errors/AppError';
import {getCustomRepository} from 'typeorm'
import TransactionsRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const transaction = await transactionsRepository.findOne({
      where: {id}
    })

    if (!transaction) {
      throw new AppError('Transaction id does not exist.')
    }

    transactionsRepository.remove(transaction)
  }
}

export default DeleteTransactionService;
