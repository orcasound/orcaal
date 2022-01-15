/*
 * Copyright (c) 2009, Mozilla Corp
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY <copyright holder> ''AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Based on sample code from the OpenGL(R) ES 2.0 Programming Guide, which carriers
 * the following header:
 *
 * Book:      OpenGL(R) ES 2.0 Programming Guide
 * Authors:   Aaftab Munshi, Dan Ginsburg, Dave Shreiner
 * ISBN-10:   0321502795
 * ISBN-13:   9780321502797
 * Publisher: Addison-Wesley Professional
 * URLs:      http://safari.informit.com/9780321563835
 *            http://www.opengles-book.com
 */

//
// A simple 4x4 Matrix utility class
//

class Matrix4x4 {
    elements: number[]
    constructor() {
        this.elements = Array(16)
        this.loadIdentity()
    }
    scale(sx: number, sy: number, sz: number) {
        this.elements[0 * 4 + 0] *= sx
        this.elements[0 * 4 + 1] *= sx
        this.elements[0 * 4 + 2] *= sx
        this.elements[0 * 4 + 3] *= sx

        this.elements[1 * 4 + 0] *= sy
        this.elements[1 * 4 + 1] *= sy
        this.elements[1 * 4 + 2] *= sy
        this.elements[1 * 4 + 3] *= sy

        this.elements[2 * 4 + 0] *= sz
        this.elements[2 * 4 + 1] *= sz
        this.elements[2 * 4 + 2] *= sz
        this.elements[2 * 4 + 3] *= sz

        return this
    }

    translate(tx: number, ty: number, tz: number) {
        this.elements[3 * 4 + 0] +=
            this.elements[0 * 4 + 0] * tx +
            this.elements[1 * 4 + 0] * ty +
            this.elements[2 * 4 + 0] * tz
        this.elements[3 * 4 + 1] +=
            this.elements[0 * 4 + 1] * tx +
            this.elements[1 * 4 + 1] * ty +
            this.elements[2 * 4 + 1] * tz
        this.elements[3 * 4 + 2] +=
            this.elements[0 * 4 + 2] * tx +
            this.elements[1 * 4 + 2] * ty +
            this.elements[2 * 4 + 2] * tz
        this.elements[3 * 4 + 3] +=
            this.elements[0 * 4 + 3] * tx +
            this.elements[1 * 4 + 3] * ty +
            this.elements[2 * 4 + 3] * tz

        return this
    }

    rotate(angle: number, x: number, y: number, z: number) {
        const mag = Math.sqrt(x * x + y * y + z * z)
        const sinAngle = Math.sin((angle * Math.PI) / 180.0)
        const cosAngle = Math.cos((angle * Math.PI) / 180.0)

        if (mag > 0) {
            let rotMat

            x /= mag
            y /= mag
            z /= mag

            const xx = x * x
            const yy = y * y
            const zz = z * z
            const xy = x * y
            const yz = y * z
            const zx = z * x
            const xs = x * sinAngle
            const ys = y * sinAngle
            const zs = z * sinAngle
            const oneMinusCos = 1.0 - cosAngle

            rotMat = new Matrix4x4()

            rotMat.elements[0 * 4 + 0] = oneMinusCos * xx + cosAngle
            rotMat.elements[0 * 4 + 1] = oneMinusCos * xy - zs
            rotMat.elements[0 * 4 + 2] = oneMinusCos * zx + ys
            rotMat.elements[0 * 4 + 3] = 0.0

            rotMat.elements[1 * 4 + 0] = oneMinusCos * xy + zs
            rotMat.elements[1 * 4 + 1] = oneMinusCos * yy + cosAngle
            rotMat.elements[1 * 4 + 2] = oneMinusCos * yz - xs
            rotMat.elements[1 * 4 + 3] = 0.0

            rotMat.elements[2 * 4 + 0] = oneMinusCos * zx - ys
            rotMat.elements[2 * 4 + 1] = oneMinusCos * yz + xs
            rotMat.elements[2 * 4 + 2] = oneMinusCos * zz + cosAngle
            rotMat.elements[2 * 4 + 3] = 0.0

            rotMat.elements[3 * 4 + 0] = 0.0
            rotMat.elements[3 * 4 + 1] = 0.0
            rotMat.elements[3 * 4 + 2] = 0.0
            rotMat.elements[3 * 4 + 3] = 1.0

            rotMat = rotMat.multiply(this)
            this.elements = rotMat.elements
        }

        return this
    }

    frustum(
        left: number,
        right: number,
        bottom: number,
        top: number,
        nearZ: number,
        farZ: number
    ) {
        const deltaX = right - left
        const deltaY = top - bottom
        const deltaZ = farZ - nearZ
        let frust

        if (
            nearZ <= 0.0 ||
            farZ <= 0.0 ||
            deltaX <= 0.0 ||
            deltaY <= 0.0 ||
            deltaZ <= 0.0
        )
            return this

        frust = new Matrix4x4()

        frust.elements[0 * 4 + 0] = (2.0 * nearZ) / deltaX
        frust.elements[0 * 4 + 1] = frust.elements[0 * 4 + 2] = frust.elements[
            0 * 4 + 3
        ] = 0.0

        frust.elements[1 * 4 + 1] = (2.0 * nearZ) / deltaY
        frust.elements[1 * 4 + 0] = frust.elements[1 * 4 + 2] = frust.elements[
            1 * 4 + 3
        ] = 0.0

        frust.elements[2 * 4 + 0] = (right + left) / deltaX
        frust.elements[2 * 4 + 1] = (top + bottom) / deltaY
        frust.elements[2 * 4 + 2] = -(nearZ + farZ) / deltaZ
        frust.elements[2 * 4 + 3] = -1.0

        frust.elements[3 * 4 + 2] = (-2.0 * nearZ * farZ) / deltaZ
        frust.elements[3 * 4 + 0] = frust.elements[3 * 4 + 1] = frust.elements[
            3 * 4 + 3
        ] = 0.0

        frust = frust.multiply(this)
        this.elements = frust.elements

        return this
    }

    perspective(fovy: number, aspect: number, nearZ: number, farZ: number) {
        const frustumH = Math.tan((fovy / 360.0) * Math.PI) * nearZ
        const frustumW = frustumH * aspect

        return this.frustum(
            -frustumW,
            frustumW,
            -frustumH,
            frustumH,
            nearZ,
            farZ
        )
    }

    ortho(
        left: number,
        right: number,
        bottom: number,
        top: number,
        nearZ: number,
        farZ: number
    ) {
        const deltaX = right - left
        const deltaY = top - bottom
        const deltaZ = farZ - nearZ

        let ortho = new Matrix4x4()

        if (deltaX == 0.0 || deltaY == 0.0 || deltaZ == 0.0) return this

        ortho.elements[0 * 4 + 0] = 2.0 / deltaX
        ortho.elements[3 * 4 + 0] = -(right + left) / deltaX
        ortho.elements[1 * 4 + 1] = 2.0 / deltaY
        ortho.elements[3 * 4 + 1] = -(top + bottom) / deltaY
        ortho.elements[2 * 4 + 2] = -2.0 / deltaZ
        ortho.elements[3 * 4 + 2] = -(nearZ + farZ) / deltaZ

        ortho = ortho.multiply(this)
        this.elements = ortho.elements

        return this
    }

    multiply(right: Matrix4x4) {
        const tmp = new Matrix4x4()

        for (let i = 0; i < 4; i++) {
            tmp.elements[i * 4 + 0] =
                this.elements[i * 4 + 0] * right.elements[0 * 4 + 0] +
                this.elements[i * 4 + 1] * right.elements[1 * 4 + 0] +
                this.elements[i * 4 + 2] * right.elements[2 * 4 + 0] +
                this.elements[i * 4 + 3] * right.elements[3 * 4 + 0]

            tmp.elements[i * 4 + 1] =
                this.elements[i * 4 + 0] * right.elements[0 * 4 + 1] +
                this.elements[i * 4 + 1] * right.elements[1 * 4 + 1] +
                this.elements[i * 4 + 2] * right.elements[2 * 4 + 1] +
                this.elements[i * 4 + 3] * right.elements[3 * 4 + 1]

            tmp.elements[i * 4 + 2] =
                this.elements[i * 4 + 0] * right.elements[0 * 4 + 2] +
                this.elements[i * 4 + 1] * right.elements[1 * 4 + 2] +
                this.elements[i * 4 + 2] * right.elements[2 * 4 + 2] +
                this.elements[i * 4 + 3] * right.elements[3 * 4 + 2]

            tmp.elements[i * 4 + 3] =
                this.elements[i * 4 + 0] * right.elements[0 * 4 + 3] +
                this.elements[i * 4 + 1] * right.elements[1 * 4 + 3] +
                this.elements[i * 4 + 2] * right.elements[2 * 4 + 3] +
                this.elements[i * 4 + 3] * right.elements[3 * 4 + 3]
        }

        this.elements = tmp.elements
        return this
    }

    copy() {
        const tmp = new Matrix4x4()
        for (let i = 0; i < 16; i++) {
            tmp.elements[i] = this.elements[i]
        }
        return tmp
    }

    get(row: number, col: number) {
        return this.elements[4 * row + col]
    }

    invert() {
        const tmp_0 = this.get(2, 2) * this.get(3, 3)
        const tmp_1 = this.get(3, 2) * this.get(2, 3)
        const tmp_2 = this.get(1, 2) * this.get(3, 3)
        const tmp_3 = this.get(3, 2) * this.get(1, 3)
        const tmp_4 = this.get(1, 2) * this.get(2, 3)
        const tmp_5 = this.get(2, 2) * this.get(1, 3)
        const tmp_6 = this.get(0, 2) * this.get(3, 3)
        const tmp_7 = this.get(3, 2) * this.get(0, 3)
        const tmp_8 = this.get(0, 2) * this.get(2, 3)
        const tmp_9 = this.get(2, 2) * this.get(0, 3)
        const tmp_10 = this.get(0, 2) * this.get(1, 3)
        const tmp_11 = this.get(1, 2) * this.get(0, 3)
        const tmp_12 = this.get(2, 0) * this.get(3, 1)
        const tmp_13 = this.get(3, 0) * this.get(2, 1)
        const tmp_14 = this.get(1, 0) * this.get(3, 1)
        const tmp_15 = this.get(3, 0) * this.get(1, 1)
        const tmp_16 = this.get(1, 0) * this.get(2, 1)
        const tmp_17 = this.get(2, 0) * this.get(1, 1)
        const tmp_18 = this.get(0, 0) * this.get(3, 1)
        const tmp_19 = this.get(3, 0) * this.get(0, 1)
        const tmp_20 = this.get(0, 0) * this.get(2, 1)
        const tmp_21 = this.get(2, 0) * this.get(0, 1)
        const tmp_22 = this.get(0, 0) * this.get(1, 1)
        const tmp_23 = this.get(1, 0) * this.get(0, 1)

        const t0 =
            tmp_0 * this.get(1, 1) +
            tmp_3 * this.get(2, 1) +
            tmp_4 * this.get(3, 1) -
            (tmp_1 * this.get(1, 1) +
                tmp_2 * this.get(2, 1) +
                tmp_5 * this.get(3, 1))
        const t1 =
            tmp_1 * this.get(0, 1) +
            tmp_6 * this.get(2, 1) +
            tmp_9 * this.get(3, 1) -
            (tmp_0 * this.get(0, 1) +
                tmp_7 * this.get(2, 1) +
                tmp_8 * this.get(3, 1))
        const t2 =
            tmp_2 * this.get(0, 1) +
            tmp_7 * this.get(1, 1) +
            tmp_10 * this.get(3, 1) -
            (tmp_3 * this.get(0, 1) +
                tmp_6 * this.get(1, 1) +
                tmp_11 * this.get(3, 1))
        const t3 =
            tmp_5 * this.get(0, 1) +
            tmp_8 * this.get(1, 1) +
            tmp_11 * this.get(2, 1) -
            (tmp_4 * this.get(0, 1) +
                tmp_9 * this.get(1, 1) +
                tmp_10 * this.get(2, 1))

        const d =
            1.0 /
            (this.get(0, 0) * t0 +
                this.get(1, 0) * t1 +
                this.get(2, 0) * t2 +
                this.get(3, 0) * t3)

        const out_00 = d * t0
        const out_01 = d * t1
        const out_02 = d * t2
        const out_03 = d * t3

        const out_10 =
            d *
            (tmp_1 * this.get(1, 0) +
                tmp_2 * this.get(2, 0) +
                tmp_5 * this.get(3, 0) -
                (tmp_0 * this.get(1, 0) +
                    tmp_3 * this.get(2, 0) +
                    tmp_4 * this.get(3, 0)))
        const out_11 =
            d *
            (tmp_0 * this.get(0, 0) +
                tmp_7 * this.get(2, 0) +
                tmp_8 * this.get(3, 0) -
                (tmp_1 * this.get(0, 0) +
                    tmp_6 * this.get(2, 0) +
                    tmp_9 * this.get(3, 0)))
        const out_12 =
            d *
            (tmp_3 * this.get(0, 0) +
                tmp_6 * this.get(1, 0) +
                tmp_11 * this.get(3, 0) -
                (tmp_2 * this.get(0, 0) +
                    tmp_7 * this.get(1, 0) +
                    tmp_10 * this.get(3, 0)))
        const out_13 =
            d *
            (tmp_4 * this.get(0, 0) +
                tmp_9 * this.get(1, 0) +
                tmp_10 * this.get(2, 0) -
                (tmp_5 * this.get(0, 0) +
                    tmp_8 * this.get(1, 0) +
                    tmp_11 * this.get(2, 0)))

        const out_20 =
            d *
            (tmp_12 * this.get(1, 3) +
                tmp_15 * this.get(2, 3) +
                tmp_16 * this.get(3, 3) -
                (tmp_13 * this.get(1, 3) +
                    tmp_14 * this.get(2, 3) +
                    tmp_17 * this.get(3, 3)))
        const out_21 =
            d *
            (tmp_13 * this.get(0, 3) +
                tmp_18 * this.get(2, 3) +
                tmp_21 * this.get(3, 3) -
                (tmp_12 * this.get(0, 3) +
                    tmp_19 * this.get(2, 3) +
                    tmp_20 * this.get(3, 3)))
        const out_22 =
            d *
            (tmp_14 * this.get(0, 3) +
                tmp_19 * this.get(1, 3) +
                tmp_22 * this.get(3, 3) -
                (tmp_15 * this.get(0, 3) +
                    tmp_18 * this.get(1, 3) +
                    tmp_23 * this.get(3, 3)))
        const out_23 =
            d *
            (tmp_17 * this.get(0, 3) +
                tmp_20 * this.get(1, 3) +
                tmp_23 * this.get(2, 3) -
                (tmp_16 * this.get(0, 3) +
                    tmp_21 * this.get(1, 3) +
                    tmp_22 * this.get(2, 3)))

        const out_30 =
            d *
            (tmp_14 * this.get(2, 2) +
                tmp_17 * this.get(3, 2) +
                tmp_13 * this.get(1, 2) -
                (tmp_16 * this.get(3, 2) +
                    tmp_12 * this.get(1, 2) +
                    tmp_15 * this.get(2, 2)))
        const out_31 =
            d *
            (tmp_20 * this.get(3, 2) +
                tmp_12 * this.get(0, 2) +
                tmp_19 * this.get(2, 2) -
                (tmp_18 * this.get(2, 2) +
                    tmp_21 * this.get(3, 2) +
                    tmp_13 * this.get(0, 2)))
        const out_32 =
            d *
            (tmp_18 * this.get(1, 2) +
                tmp_23 * this.get(3, 2) +
                tmp_15 * this.get(0, 2) -
                (tmp_22 * this.get(3, 2) +
                    tmp_14 * this.get(0, 2) +
                    tmp_19 * this.get(1, 2)))
        const out_33 =
            d *
            (tmp_22 * this.get(2, 2) +
                tmp_16 * this.get(0, 2) +
                tmp_21 * this.get(1, 2) -
                (tmp_20 * this.get(1, 2) +
                    tmp_23 * this.get(2, 2) +
                    tmp_17 * this.get(0, 2)))

        this.elements[0 * 4 + 0] = out_00
        this.elements[0 * 4 + 1] = out_01
        this.elements[0 * 4 + 2] = out_02
        this.elements[0 * 4 + 3] = out_03
        this.elements[1 * 4 + 0] = out_10
        this.elements[1 * 4 + 1] = out_11
        this.elements[1 * 4 + 2] = out_12
        this.elements[1 * 4 + 3] = out_13
        this.elements[2 * 4 + 0] = out_20
        this.elements[2 * 4 + 1] = out_21
        this.elements[2 * 4 + 2] = out_22
        this.elements[2 * 4 + 3] = out_23
        this.elements[3 * 4 + 0] = out_30
        this.elements[3 * 4 + 1] = out_31
        this.elements[3 * 4 + 2] = out_32
        this.elements[3 * 4 + 3] = out_33
        return this
    }

    inverse() {
        const tmp = this.copy()
        return tmp.invert()
    }

    transpose() {
        let tmp = this.elements[0 * 4 + 1]
        this.elements[0 * 4 + 1] = this.elements[1 * 4 + 0]
        this.elements[1 * 4 + 0] = tmp

        tmp = this.elements[0 * 4 + 2]
        this.elements[0 * 4 + 2] = this.elements[2 * 4 + 0]
        this.elements[2 * 4 + 0] = tmp

        tmp = this.elements[0 * 4 + 3]
        this.elements[0 * 4 + 3] = this.elements[3 * 4 + 0]
        this.elements[3 * 4 + 0] = tmp

        tmp = this.elements[1 * 4 + 2]
        this.elements[1 * 4 + 2] = this.elements[2 * 4 + 1]
        this.elements[2 * 4 + 1] = tmp

        tmp = this.elements[1 * 4 + 3]
        this.elements[1 * 4 + 3] = this.elements[3 * 4 + 1]
        this.elements[3 * 4 + 1] = tmp

        tmp = this.elements[2 * 4 + 3]
        this.elements[2 * 4 + 3] = this.elements[3 * 4 + 2]
        this.elements[3 * 4 + 2] = tmp

        return this
    }

    loadIdentity() {
        for (let i = 0; i < 16; i++) this.elements[i] = 0
        this.elements[0 * 4 + 0] = 1.0
        this.elements[1 * 4 + 1] = 1.0
        this.elements[2 * 4 + 2] = 1.0
        this.elements[3 * 4 + 3] = 1.0
        return this
    }
}

export default Matrix4x4
