import db from '@database/connection'
import Error from '@models/Error'

abstract class Database {
  protected abstract db: IDatabase
  protected abstract data: IData
  protected abstract make (object: any): void
  private Result: any
  private fail = new Error();

  /**
   * FindId
   * @param name
   * @param RequiredFields
   * @return object
   */
  public findId (name: string, RequiredFields: Array<String> = this.db.RequiredFields): Promise<any> {
    return db(this.db.Entity)
      .select(RequiredFields)
      .where({ id: name })
      .then(object => { return object })
      .catch(err => { return err })
  }

  /**
   * Get
   * @return object||Array
   */
  async get (): Promise<any> {
    const data = await db(this.db.Entity)
      .select(this.db.RequiredFields)
      .then(object => { return object })
      .catch(err => { return err })
    return data
  }

  /**
   * Delete id
   * @param id : number
   * @return resultado
   */
  async delete (id: number): Promise<any> {
    const data = await db(this.db.Entity)
      .where({ id: id })
      .del()
      .then(object => { return object })
      .catch(err => { return err })
    return data
  }

  /**
   * Set update
   * @param object object
   * @return object
   */
  private async update (object: any): Promise<any> {
    return db(this.db.Entity)
      .update(object)
      .where({
        id: object.id
      })
      .then(objects => { return (objects != null && objects ? object.id : this.fail.setError('Erro ao fazer o Update')) })
      .catch(err => { return this.fail.setError(err) })
  }

  /**
   * Create DB
   * @param object Object
   * @return object
   */
  private async create (object: any): Promise<any> {
    const data = await db(this.db.Entity)
      .insert(object)
      .then(object => { return object })
      .catch(err => { return this.fail.setError(err) })
    return data
  }

  /**
   * Save DB
   * @param returnData
   * @return result
   */
  async save (returnData: boolean = true): Promise<any> {
    let result = null
    /** Verifica se tem objeto */
    if (this.data == null || this.db == null) {
      return { message: 'Ocorreu um error no model iniciado' }
    }
    if (this.data.id != null) {
      result = await this.update(this.data)
    } else {
      result = await this.create(this.data)
    }
    if (this.fail.Status()) {
      return this.fail.Error()
    }
    if (returnData) {
      result = this.findId(result)
    }
    return result
  }

  /**
   * *************
   * ** Helpers **
   * *************
   */

  /**
   * requiredFields
   * @param requiredFields
   * @return void
   */
  public requiredFields (requiredFields: Array<string>): void {
    this.db.RequiredFields = requiredFields
  }
}

export default Database
