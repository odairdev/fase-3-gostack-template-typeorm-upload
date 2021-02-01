import { getCustomRepository, getRepository } from 'typeorm'

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository'
import Category from '../models/Category'
import Transaction from '../models/Transaction';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string,
}

class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getRepository(Category)

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type invalid');
    }
    
    let categoryExists = await categoryRepository.findOne({
      where: {title: category}
    })

    if (!categoryExists) {
      categoryExists = await categoryRepository.create({
        title: category
      })
    }

    await categoryRepository.save(categoryExists)

    const transactions = await transactionsRepository.find()
    const { total } = await transactionsRepository.getBalance(transactions)

    if (type === 'outcome' && total < value) {
      throw new AppError('Not enough balance to do this transaction.')
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryExists
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
