import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"

export const CurrentUser = createParamDecorator(
  (field: keyof User, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user
    return field ? user[field] : user
  },
)
