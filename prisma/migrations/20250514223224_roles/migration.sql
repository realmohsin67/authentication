-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Manual Migration --

INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgebi000cxt0ve8vo5a8m', 'create', 'user', 'own', '', '2025-05-18 16:57:45.342', '2025-05-18 16:57:45.342');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwged7000dxt0vjg42op3j', 'create', 'user', 'any', '', '2025-05-18 16:57:45.403', '2025-05-18 16:57:45.403');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgeer000ext0v3bynaeib', 'read', 'user', 'own', '', '2025-05-18 16:57:45.46', '2025-05-18 16:57:45.46');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgeg6000fxt0vz17ry4sm', 'read', 'user', 'any', '', '2025-05-18 16:57:45.511', '2025-05-18 16:57:45.511');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgehn000gxt0vxc84grqe', 'update', 'user', 'own', '', '2025-05-18 16:57:45.564', '2025-05-18 16:57:45.564');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgej0000hxt0vfdffvpvb', 'update', 'user', 'any', '', '2025-05-18 16:57:45.612', '2025-05-18 16:57:45.612');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgekf000ixt0vydwsg3kc', 'delete', 'user', 'own', '', '2025-05-18 16:57:45.663', '2025-05-18 16:57:45.663');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgem8000jxt0v67m5iw8h', 'delete', 'user', 'any', '', '2025-05-18 16:57:45.729', '2025-05-18 16:57:45.729');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgenn000kxt0vaqta98ks', 'create', 'post', 'own', '', '2025-05-18 16:57:45.779', '2025-05-18 16:57:45.779');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgep1000lxt0vse5ndrv6', 'create', 'post', 'any', '', '2025-05-18 16:57:45.829', '2025-05-18 16:57:45.829');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgeqk000mxt0vo829m0q1', 'read', 'post', 'own', '', '2025-05-18 16:57:45.884', '2025-05-18 16:57:45.884');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgerv000nxt0v28ygfn7u', 'read', 'post', 'any', '', '2025-05-18 16:57:45.931', '2025-05-18 16:57:45.931');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgetf000oxt0vu335k0sp', 'update', 'post', 'own', '', '2025-05-18 16:57:45.988', '2025-05-18 16:57:45.988');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgeut000pxt0vzs56la81', 'update', 'post', 'any', '', '2025-05-18 16:57:46.037', '2025-05-18 16:57:46.037');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgew1000qxt0v2h0molla', 'delete', 'post', 'own', '', '2025-05-18 16:57:46.081', '2025-05-18 16:57:46.081');
INSERT INTO "Permission" (id, action, entity, access, description, "createdAt", "updatedAt") VALUES ('cmatwgexd000rxt0veljfkcwt', 'delete', 'post', 'any', '', '2025-05-18 16:57:46.13', '2025-05-18 16:57:46.13');

INSERT INTO "Role" (id, name, description, "createdAt", "updatedAt") VALUES ('cmatwgf08000sxt0vja3krr3h', 'admin', '', '2025-05-18 16:57:46.232', '2025-05-18 16:57:46.232');
INSERT INTO "Role" (id, name, description, "createdAt", "updatedAt") VALUES ('cmatwgf5e000txt0v62ojnrnj', 'user', '', '2025-05-18 16:57:46.418', '2025-05-18 16:57:46.418');

INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwged7000dxt0vjg42op3j', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgeg6000fxt0vz17ry4sm', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgej0000hxt0vfdffvpvb', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgem8000jxt0v67m5iw8h', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgep1000lxt0vse5ndrv6', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgerv000nxt0v28ygfn7u', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgeut000pxt0vzs56la81', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgexd000rxt0veljfkcwt', 'cmatwgf08000sxt0vja3krr3h');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgebi000cxt0ve8vo5a8m', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgeer000ext0v3bynaeib', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgehn000gxt0vxc84grqe', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgekf000ixt0vydwsg3kc', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgenn000kxt0vaqta98ks', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgeqk000mxt0vo829m0q1', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgetf000oxt0vu335k0sp', 'cmatwgf5e000txt0v62ojnrnj');
INSERT INTO "_PermissionToRole" ("A", "B") VALUES ('cmatwgew1000qxt0v2h0molla', 'cmatwgf5e000txt0v62ojnrnj');
